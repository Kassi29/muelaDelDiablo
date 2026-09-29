import type { ReactNode } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router';
import { findStory, type Story } from '../data/stories';
import { BackButton } from './BackButton';
import '../styles/activities.css';

interface Props {
  variant: 'order' | 'differences' | 'find';
  titleImage: string;
  titleAlt: string;
  instructions: ReactNode;
  back: { to: string; label: string };
  next?: string;
  won: boolean;
  children: ReactNode;
}

/** Marco común de los 3 juegos: navegación atrás/siguiente, título de madera, instrucciones y confeti al ganar. */
export function ActivityLayout({ variant, titleImage, titleAlt, instructions, back, next, won, children }: Props) {
  return (
    <div className={`game game-${variant}`}>
      <nav className="game-nav">
        <BackButton to={back.to}>{back.label}</BackButton>
        {next && <NextLink to={next} />}
      </nav>
      <div className="game-title">
        <img src={titleImage} alt={titleAlt} width={1200} height={300} />
        {won && <Confetti />}
      </div>
      <p className="game-instructions">{instructions}</p>
      {children}
    </div>
  );
}

export function NextLink({ to }: { to: string }) {
  return (
    <Link to={to} className="wood-link wood-link-next">
      <span className="wood-link-text">Siguiente actividad</span>
      <img src="/assets/ui/flecha-siguiente.webp" alt="" className="wood-link-arrow" width={400} height={250} />
    </Link>
  );
}

/** Cartel "¡Bien hecho!" que tapa el juego al completarlo. */
export function WinBanner({ next }: { next?: string }) {
  return (
    <div className="win-banner anim-fade-in" role="status">
      <img src="/assets/juegos/ui/bien-hecho.webp" alt="¡Bien hecho!" className="win-banner-img" width={1200} height={300} />
      {next && (
        <Link to={next} className="win-banner-next" aria-label="Siguiente actividad">
          <img src="/assets/ui/flecha-siguiente.webp" alt="" width={400} height={250} />
        </Link>
      )}
    </div>
  );
}

const CONFETTI_COLORS = ['var(--color-primary)', 'var(--color-secondary)', 'var(--color-accent)', 'var(--color-nature)', 'var(--color-info)'];
const CONFETTI = Array.from({ length: 50 }, (_, i) => ({
  left: `${Math.random() * 80 + 10}%`,
  top: `${Math.random() * 100}%`,
  background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  animationDelay: `${Math.random() * 1.5}s`,
}));

function Confetti() {
  return (
    <div className="confetti" aria-hidden>
      {CONFETTI.map((style, i) => (
        <span key={i} className="confetti-particle" style={style} />
      ))}
    </div>
  );
}

/** Lee ?story= de la URL (así llegan los QR). Si no es válido, vuelve al inicio. */
export function useStoryParam(): Story | null {
  const [params] = useSearchParams();
  return findStory(params.get('story')) ?? null;
}

export const GoHome = () => <Navigate to="/" replace />;
