import type { ReactNode } from 'react';
import { Link } from 'react-router';

interface Props {
  to: string;
  children: ReactNode;
}

/** Botón de madera "atrás" usado en el lector y los juegos. */
export function BackButton({ to, children }: Props) {
  return (
    <Link to={to} className="wood-link wood-link-back">
      <img src="/assets/ui/boton-atras.webp" alt="" className="wood-link-arrow" width={400} height={250} />
      <span className="wood-link-text">{children}</span>
    </Link>
  );
}
