import { useCallback, useEffect, useState } from 'react';
import { characters, getCharacter, type CharacterId } from '../../../shared/characters';
import {
  MAX_HISTORY_TURNS,
  MAX_INPUT_CHARS,
  MAX_TURN_CHARS,
  type ChatRequest,
  type ChatResponse,
  type ChatTurn,
} from '../../../shared/chat-limits';

export interface ChatMessage {
  from: 'user' | 'character';
  text: string;
  time: string;
}

type Conversations = Record<CharacterId, ChatMessage[]>;

// sessionStorage: la charla sobrevive a la navegación pero no queda guardada en el dispositivo.
const STORAGE_KEY = 'muela-chat-v1';

const now = () => new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit', hour12: false });

const greeting = (id: CharacterId): ChatMessage => ({ from: 'character', text: getCharacter(id).greeting, time: now() });

function freshConversations(): Conversations {
  return Object.fromEntries(characters.map((c) => [c.id, [greeting(c.id)]])) as Conversations;
}

function loadConversations(): Conversations {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? 'null') as Partial<Conversations> | null;
    return { ...freshConversations(), ...saved };
  } catch {
    return freshConversations();
  }
}

/** Contexto para el servidor: pares completos (usuario, personaje), sin el saludo inicial. */
function toHistory(messages: ChatMessage[]): ChatTurn[] {
  const pairs: ChatTurn[][] = [];
  for (let i = 1; i < messages.length - 1; i++) {
    if (messages[i].from === 'user' && messages[i + 1].from === 'character') {
      pairs.push([
        { role: 'user', text: messages[i].text.slice(0, MAX_TURN_CHARS) },
        { role: 'model', text: messages[i + 1].text.slice(0, MAX_TURN_CHARS) },
      ]);
      i++;
    }
  }
  return pairs.slice(-MAX_HISTORY_TURNS / 2).flat();
}

async function requestReply(body: ChatRequest): Promise<string> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as Partial<ChatResponse>;
    if (data.reply) return data.reply;
  } catch {
    // Sin conexión o respuesta inválida: cae al mensaje de abajo.
  }
  return '¡Oh! Parece que se cortó la magia. ¿Me lo escribes otra vez?';
}

export function useChat() {
  const [conversations, setConversations] = useState<Conversations>(loadConversations);
  const [pending, setPending] = useState<Partial<Record<CharacterId, boolean>>>({});

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch {
      // Modo privado o almacenamiento lleno: la charla sigue funcionando en memoria.
    }
  }, [conversations]);

  const append = (id: CharacterId, message: ChatMessage) =>
    setConversations((all) => ({ ...all, [id]: [...all[id], message] }));

  const send = useCallback(
    async (id: CharacterId, input: string) => {
      const text = input.trim().slice(0, MAX_INPUT_CHARS);
      if (!text || pending[id]) return;

      const history = toHistory(conversations[id]);
      append(id, { from: 'user', text, time: now() });
      setPending((p) => ({ ...p, [id]: true }));
      const reply = await requestReply({ characterId: id, message: text, history });
      append(id, { from: 'character', text: reply, time: now() });
      setPending((p) => ({ ...p, [id]: false }));
    },
    [conversations, pending],
  );

  const reset = (id: CharacterId) => setConversations((all) => ({ ...all, [id]: [greeting(id)] }));

  return { conversations, pending, send, reset };
}
