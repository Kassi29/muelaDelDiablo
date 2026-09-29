import { useEffect, useRef, useState, type FormEvent } from 'react';
import { characters, getCharacter, type CharacterId } from '../../shared/characters';
import { MAX_INPUT_CHARS } from '../../shared/chat-limits';
import { useChat } from '../features/chat/useChat';
import '../styles/chat.css';

export function Chat() {
  const [selected, setSelected] = useState<CharacterId | null>(null);
  const { conversations, pending, send, reset } = useChat();

  return (
    <div className="chat-page">
      <div className={`chat-canvas${selected ? ' is-active' : ''}`}>
        <div className="chat-bg chat-bg-list" />
        <div className="chat-bg chat-bg-open" />

        {/* Zona invisible sobre el título "CHATS" del dibujo: vuelve a la lista. */}
        <button type="button" className="chat-title-zone" onClick={() => setSelected(null)} aria-label="Volver a la lista de chats" />

        <ul className="chat-slots">
          {characters.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className="chat-slot"
                aria-pressed={selected === c.id}
                onClick={() => setSelected(c.id)}
              >
                <img src={c.avatar} alt="" className="chat-avatar" width={256} height={256} />
                <span className="chat-slot-name">{c.displayName}</span>
              </button>
            </li>
          ))}
        </ul>

        {selected && (
          <Conversation
            key={selected}
            id={selected}
            messages={conversations[selected]}
            pending={!!pending[selected]}
            onSend={(text) => send(selected, text)}
            onReset={() => reset(selected)}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </div>
  );
}

interface ConversationProps {
  id: CharacterId;
  messages: ReturnType<typeof useChat>['conversations'][CharacterId];
  pending: boolean;
  onSend: (text: string) => void;
  onReset: () => void;
  onClose: () => void;
}

function Conversation({ id, messages, pending, onSend, onReset, onClose }: ConversationProps) {
  const character = getCharacter(id);
  const [draft, setDraft] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length, pending]);

  useEffect(() => {
    if (!pending) inputRef.current?.focus({ preventScroll: true });
  }, [pending]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || pending) return;
    onSend(draft);
    setDraft('');
  };

  const remaining = MAX_INPUT_CHARS - draft.length;

  return (
    <section className="chat-panel" aria-label={`Chat con ${character.displayName}`}>
      <button type="button" className="chat-mobile-back" onClick={onClose} aria-label="Volver a la lista de chats">
        <img src="/assets/ui/boton-atras.webp" alt="" width={400} height={250} />
      </button>

      <header className="chat-header">
        <img src={character.avatar} alt="" className="chat-avatar chat-header-avatar" width={256} height={256} />
        <h2 className="chat-header-name">{character.displayName}</h2>
        <button type="button" className="chat-reset" onClick={onReset} disabled={pending} title="Empezar una charla nueva">
          ↺ Nueva charla
        </button>
      </header>

      {/* Los mensajes se muestran como texto: nunca se interpreta HTML. */}
      <div ref={listRef} className="chat-messages" aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg chat-msg-${m.from}`}>
            <p className="chat-bubble">
              {m.text}
              <time className="chat-time">{m.time}</time>
            </p>
          </div>
        ))}
        {pending && (
          <div className="chat-msg chat-msg-character">
            <p className="chat-bubble chat-typing" aria-label={`${character.displayName} está escribiendo`}>
              <span />
              <span />
              <span />
            </p>
          </div>
        )}
      </div>

      <form className="chat-form" onSubmit={submit}>
        <input
          ref={inputRef}
          className="chat-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={MAX_INPUT_CHARS}
          placeholder="Escribir mensaje..."
          aria-label="Escribe tu mensaje"
          autoComplete="off"
          enterKeyHint="send"
        />
        <span className={`chat-counter${remaining <= 20 ? ' is-low' : ''}`} aria-live="polite">
          {draft.length}/{MAX_INPUT_CHARS}
        </span>
        <button type="submit" className="chat-send" disabled={pending || !draft.trim()} aria-label="Enviar mensaje" />
      </form>
    </section>
  );
}
