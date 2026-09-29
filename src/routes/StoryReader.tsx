import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { BackButton } from '../components/BackButton';
import { findStory, storyAssets, type Story } from '../data/stories';
import { useMediaQuery } from '../hooks/useMediaQuery';
import '../styles/reader.css';

export function StoryReader() {
  const story = findStory(useParams().id);
  const [reading, setReading] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (!story) {
    return (
      <div className="reader">
        <div className="reader-cover">
          <h2 className="reader-missing">No encontramos ese cuento</h2>
          <BackButton to="/">Volver al mapa</BackButton>
        </div>
      </div>
    );
  }

  const assets = storyAssets(story.id);
  return (
    <div className="reader">
      {!reading ? (
        <div className="reader-cover">
          <div className="reader-top-bar">
            <BackButton to="/">Volver al mapa</BackButton>
          </div>
          <img src={assets.pergamino} alt={story.title} className="reader-pergamino" width={1200} height={300} />
          <img src={assets.cover} alt={`Portada de ${story.title}`} className="reader-cover-img" width={1000} height={1000} />
          <button type="button" className="reader-start" onClick={() => setReading(true)}>
            <img src="/assets/cuentos/ui/boton-empezar.webp" alt="Empezar lectura" width={600} height={375} />
          </button>
        </div>
      ) : isMobile ? (
        <MobileBook story={story} />
      ) : (
        <DesktopBook story={story} />
      )}
    </div>
  );
}

function preload(srcs: string[]) {
  for (const src of srcs) new Image().src = src;
}

/** Móvil: una página a la vez, con flechas y deslizando el dedo. */
function MobileBook({ story }: { story: Story }) {
  const [page, setPage] = useState(1);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const { page: pageSrc } = storyAssets(story.id);

  useEffect(() => {
    preload([page - 1, page + 1].filter((n) => n >= 1 && n <= story.pageCount).map(pageSrc));
  }, [page, story.pageCount, pageSrc]);

  const go = (delta: number) => setPage((p) => Math.min(story.pageCount, Math.max(1, p + delta)));

  return (
    <div className="book-mobile">
      <div className="reader-top-bar">
        <BackButton to="/">Mapa</BackButton>
        <span className="book-mobile-counter">
          Página {page} de {story.pageCount}
        </span>
      </div>
      <div
        className="book-mobile-stage"
        onTouchStart={(e) => (touchStart.current = { x: e.changedTouches[0].screenX, y: e.changedTouches[0].screenY })}
        onTouchEnd={(e) => {
          if (!touchStart.current) return;
          const dx = e.changedTouches[0].screenX - touchStart.current.x;
          const dy = e.changedTouches[0].screenY - touchStart.current.y;
          if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 45) go(dx > 0 ? -1 : 1);
        }}
      >
        <div key={page} className="book-mobile-page">
          <img src={pageSrc(page)} alt={`Página ${page}`} width={709} height={709} />
        </div>
        <PageArrow direction="prev" disabled={page === 1} onClick={() => go(-1)} />
        <PageArrow direction="next" disabled={page === story.pageCount} onClick={() => go(1)} />
      </div>
      <p className="book-mobile-hint">👈 Desliza para cambiar de página 👉</p>
    </div>
  );
}

type Flip = { direction: 'forward' | 'backward'; target: number };

/** Escritorio: libro abierto a doble página. La primera doble página tiene la izquierda en blanco. */
function DesktopBook({ story }: { story: Story }) {
  const [spread, setSpread] = useState(1);
  const [flip, setFlip] = useState<Flip | null>(null);
  const totalSpreads = Math.ceil((story.pageCount + 1) / 2);
  const assets = storyAssets(story.id);

  const leftPage = (s: number) => (s === 1 || (s - 1) * 2 > story.pageCount ? null : (s - 1) * 2);
  const rightPage = (s: number) => {
    const n = s === 1 ? 1 : (s - 1) * 2 + 1;
    return n <= story.pageCount ? n : null;
  };

  useEffect(() => {
    const neighbours = [spread - 1, spread + 1].filter((s) => s >= 1 && s <= totalSpreads);
    preload(neighbours.flatMap((s) => [leftPage(s), rightPage(s)]).filter((n): n is number => n !== null).map(assets.page));
  }, [spread]); // las funciones de página solo dependen de story, que no cambia en este componente

  const src = (page: number | null) => (page ? assets.page(page) : null);

  const startFlip = (direction: Flip['direction']) => {
    if (flip) return;
    setFlip({ direction, target: direction === 'forward' ? spread + 1 : spread - 1 });
  };

  // Mientras la hoja gira, debajo ya se ve la página de destino del lado que se destapa.
  const staticLeft = flip?.direction === 'backward' ? leftPage(flip.target) : leftPage(spread);
  const staticRight = flip?.direction === 'forward' ? rightPage(flip.target) : rightPage(spread);

  return (
    <div className="book-desktop">
      <div className="reader-top-bar">
        <BackButton to="/">Mapa</BackButton>
      </div>
      <div className="book-stage">
        <PageArrow direction="prev" disabled={spread === 1} onClick={() => startFlip('backward')} />
        <div className="book-frame">
          <img src={assets.openBook} alt="" className="book-base" width={2000} height={1000} />
          <div className="book-pages">
            <PageHalf side="left" src={src(staticLeft)} />
            <PageHalf side="right" src={src(staticRight)} />
            {flip && (
              <div
                className={`page-leaf page-leaf-${flip.direction}`}
                onAnimationEnd={() => {
                  setSpread(flip.target);
                  setFlip(null);
                }}
              >
                {flip.direction === 'forward' ? (
                  <>
                    <PageHalf side="right" src={src(rightPage(spread))} face="front" />
                    <PageHalf side="left" src={src(leftPage(flip.target))} face="back" />
                  </>
                ) : (
                  <>
                    <PageHalf side="left" src={src(leftPage(spread))} face="front" />
                    <PageHalf side="right" src={src(rightPage(flip.target))} face="back" />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <PageArrow direction="next" disabled={spread === totalSpreads} onClick={() => startFlip('forward')} />
      </div>
    </div>
  );
}

function PageHalf({ side, src, face }: { side: 'left' | 'right'; src: string | null; face?: 'front' | 'back' }) {
  const className = face ? `leaf-face leaf-${face} page-half-${side}` : `page-half page-half-${side}`;
  return (
    <div className={className}>{src ? <img src={src} alt="" className="page-img" /> : <div className="page-blank" />}</div>
  );
}

function PageArrow({ direction, disabled, onClick }: { direction: 'prev' | 'next'; disabled: boolean; onClick: () => void }) {
  const label = direction === 'prev' ? 'Página anterior' : 'Página siguiente';
  return (
    <button type="button" className={`page-arrow page-arrow-${direction}`} disabled={disabled} onClick={onClick} aria-label={label}>
      <img src={`/assets/cuentos/ui/flecha-${direction === 'prev' ? 'izq' : 'der'}.webp`} alt="" width={300} height={188} />
    </button>
  );
}
