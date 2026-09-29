// POST /api/chat: proxy entre los niños y Gemini. La llave solo existe aquí, como secreto de Cloudflare.
import { getCharacter, isCharacterId, type Character } from '../../shared/characters';
import {
  DAILY_MESSAGES_PER_IP,
  MAX_HISTORY_TURNS,
  MAX_INPUT_CHARS,
  MAX_REPLY_CHARS,
  MAX_TURN_CHARS,
  type ChatResponse,
  type ChatTurn,
} from '../../shared/chat-limits';
import { buildSystemPrompt } from '../../shared/prompt';

interface Env {
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
  /** Opcional: si existe, aplica el tope diario de mensajes por IP. */
  CHAT_LIMITS?: KVNamespace;
}

const DEFAULT_MODEL = 'gemini-flash-latest';
const MAX_BODY_BYTES = 8 * 1024;

const SAFETY_SETTINGS = [
  'HARM_CATEGORY_HARASSMENT',
  'HARM_CATEGORY_HATE_SPEECH',
  'HARM_CATEGORY_SEXUALLY_EXPLICIT',
  'HARM_CATEGORY_DANGEROUS_CONTENT',
].map((category) => ({ category, threshold: 'BLOCK_LOW_AND_ABOVE' }));

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // Solo se acepta desde la propia web (Host coincide también detrás del proxy de Vite en desarrollo).
  const origin = request.headers.get('Origin');
  if (origin && new URL(origin).host !== (request.headers.get('Host') ?? new URL(request.url).host)) {
    return json({ error: 'forbidden' }, 403);
  }

  const parsed = await parseRequest(request);
  if ('error' in parsed) return json({ error: parsed.error }, 400);
  const { character, message, history } = parsed;

  if (await overDailyLimit(env.CHAT_LIMITS, request.headers.get('CF-Connecting-IP'))) {
    return reply(`¡Uf, hoy conversamos muchísimo y estoy cansadito! Vuelve mañana y seguimos. ${character.emoji}`, 429);
  }

  if (!env.GEMINI_API_KEY) {
    const options = character.offlineReplies;
    return reply(options[Math.floor(Math.random() * options.length)]);
  }

  try {
    const text = await askGemini(env, character, history, message);
    return reply(text ? clampReply(text) : redirectToStory(character));
  } catch (err) {
    console.error('Gemini error', err);
    const busy = err instanceof GeminiError && err.status === 429;
    return reply(
      busy
        ? `¡Uy, me duele un poquito la cabeza de tanto hablar! Espera unos segundos y pregúntame otra vez. ${character.emoji}`
        : `¡Oh! Se me enredaron las ideas. ¿Me lo preguntas de nuevo? ${character.emoji}`,
      busy ? 429 : 502,
    );
  }
};

async function parseRequest(
  request: Request,
): Promise<{ character: Character; message: string; history: ChatTurn[] } | { error: string }> {
  if (!request.headers.get('Content-Type')?.includes('application/json')) return { error: 'content-type' };
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return { error: 'too-large' };

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return { error: 'invalid-json' };
  }
  if (typeof body !== 'object' || body === null) return { error: 'invalid-body' };
  const { characterId, message, history = [] } = body as Record<string, unknown>;

  if (!isCharacterId(characterId)) return { error: 'character' };
  if (typeof message !== 'string') return { error: 'message' };
  const trimmed = message.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_INPUT_CHARS) return { error: 'message-length' };

  // El historial son pares completos (usuario, personaje): empieza en el usuario, alterna y termina en el personaje.
  // Así el cliente no puede colar turnos inventados del personaje ni mandar contexto sin fin.
  if (!Array.isArray(history) || history.length > MAX_HISTORY_TURNS || history.length % 2 !== 0) {
    return { error: 'history' };
  }
  for (const [i, turn] of history.entries()) {
    const t = turn as Partial<ChatTurn>;
    const expected = i % 2 === 0 ? 'user' : 'model';
    if (t?.role !== expected || typeof t.text !== 'string' || t.text.length > MAX_TURN_CHARS) {
      return { error: 'history' };
    }
  }

  return { character: getCharacter(characterId), message: trimmed, history: history as ChatTurn[] };
}

class GeminiError extends Error {
  constructor(readonly status: number, body: string) {
    super(`Gemini ${status}: ${body.slice(0, 300)}`);
  }
}

interface GeminiResponse {
  candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
}

async function askGemini(env: Env, character: Character, history: ChatTurn[], message: string): Promise<string> {
  const model = env.GEMINI_MODEL || DEFAULT_MODEL;
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY! },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: buildSystemPrompt(character) }] },
      contents: [...history, { role: 'user', text: message }].map((t) => ({ role: t.role, parts: [{ text: t.text }] })),
      safetySettings: SAFETY_SETTINGS,
      // maxOutputTokens queda holgado porque en modelos con "thinking" también cuenta el razonamiento;
      // el largo real lo controlan el prompt y clampReply.
      generationConfig: { temperature: 0.6, topP: 0.9, maxOutputTokens: 1024 },
    }),
  });
  if (!res.ok) throw new GeminiError(res.status, await res.text());

  const data = (await res.json()) as GeminiResponse;
  const candidate = data.candidates?.[0];
  // Bloqueado por seguridad (o sin candidato): se responde con una redirección amable.
  if (!candidate || candidate.finishReason === 'SAFETY' || candidate.finishReason === 'PROHIBITED_CONTENT') return '';
  return candidate.content?.parts?.map((p) => p.text ?? '').join('') ?? '';
}

function redirectToStory(character: Character): string {
  return `¡Uy! De eso mejor no hablo. ¿Quieres que te cuente algo de mi aventura? ${character.emoji}`;
}

/** Deja texto plano, sin markdown, cortado en la última oración completa y dentro del tope. */
function clampReply(text: string): string {
  let clean = text
    .replace(/<[^>]*>/g, '')
    .replace(/[*_#`>~]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (clean.length > MAX_REPLY_CHARS) clean = clean.slice(0, MAX_REPLY_CHARS);

  const endsWell = /[.!?…]$|\p{Extended_Pictographic}$/u.test(clean);
  if (!endsWell) {
    const lastStop = Math.max(clean.lastIndexOf('.'), clean.lastIndexOf('!'), clean.lastIndexOf('?'));
    if (lastStop > 20) clean = clean.slice(0, lastStop + 1);
  }
  return clean;
}

async function overDailyLimit(kv: KVNamespace | undefined, ip: string | null): Promise<boolean> {
  if (!kv || !ip) return false;
  const key = `${ip}:${new Date().toISOString().slice(0, 10)}`;
  const count = Number((await kv.get(key)) ?? 0);
  if (count >= DAILY_MESSAGES_PER_IP) return true;
  await kv.put(key, String(count + 1), { expirationTtl: 60 * 60 * 24 });
  return false;
}

function reply(text: string, status = 200): Response {
  return json({ reply: text } satisfies ChatResponse, status);
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
