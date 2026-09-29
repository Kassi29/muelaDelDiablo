// Límites del chat compartidos entre el navegador y la Pages Function.
// Si cambias alguno, ambos lados se actualizan juntos.

/** Máximo de caracteres que un niño puede escribir por mensaje. */
export const MAX_INPUT_CHARS = 200;

/** Turnos previos que se envían como contexto (número par: pares usuario + personaje). */
export const MAX_HISTORY_TURNS = 10;

/** Largo máximo de cada turno del historial (las respuestas del personaje rondan 300). */
export const MAX_TURN_CHARS = 500;

/** Tope duro de la respuesta del personaje, después de recortarla a oraciones completas. */
export const MAX_REPLY_CHARS = 450;

/** Mensajes por IP y por día (se cuentan en KV si el binding existe). */
export const DAILY_MESSAGES_PER_IP = 150;

export type ChatRole = 'user' | 'model';

export interface ChatTurn {
  role: ChatRole;
  text: string;
}

export interface ChatRequest {
  characterId: string;
  message: string;
  history: ChatTurn[];
}

export interface ChatResponse {
  reply: string;
}
