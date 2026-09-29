import { BackButton } from '../components/BackButton';

export function NotFound() {
  return (
    <div className="not-found">
      <h1>¡Uy! Esta página se perdió en el bosque</h1>
      <BackButton to="/">Volver al mapa</BackButton>
    </div>
  );
}
