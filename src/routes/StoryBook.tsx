import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { BackButton } from '../components/BackButton';
import { readerBooks, type ReaderPage } from '../data/readerBooks';
import type { Story, StoryId } from '../data/stories';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { paths } from '../paths';
import '../styles/storybook.css';

gsap.registerPlugin(useGSAP);

type Flip = { direction: 'forward' | 'backward'; target: number };

function IllustrationPage({ storyId, scene, discovered, onDiscover }: { storyId: StoryId; scene: ReaderPage; discovered?: boolean; onDiscover?: () => void }) {
  const cropStyle = scene.cutoff === undefined ? undefined : { '--crop-top': `${scene.cutoff}%` } as CSSProperties;

  return <div className="storybook-paper storybook-paper-left">
    <div className={`storybook-art storybook-art-${scene.crop} storybook-art-story-${storyId} storybook-art-page-${scene.image}`} style={cropStyle}>
      <div className="storybook-art-window" role="img" aria-label={scene.imageAlt}>
        <img src={`/assets/cuentos/${storyId}/${scene.image}.webp`} alt="" draggable="false" />
      </div>
      <span className="storybook-art-sun" aria-hidden="true">✺</span>
      <span className="storybook-art-star storybook-art-star-one" aria-hidden="true">✦</span>
      <span className="storybook-art-star storybook-art-star-two" aria-hidden="true">✧</span>
      {discovered && <span className="storybook-art-magic" aria-hidden="true">✦ ✧ ✦</span>}
    </div>
    <span className="storybook-art-credit">Ilustración original del cuento</span>
    {onDiscover && <button type="button" className="storybook-art-touch" onClick={onDiscover} aria-label={scene.prompt}>✦ <span>Toca para descubrir</span></button>}
  </div>;
}

function TextPage({ storyId, scene, page, lastPage, discovered, onDiscover }: { storyId: StoryId; scene: ReaderPage; page: number; lastPage: number; discovered?: boolean; onDiscover?: () => void }) {
  return <div className="storybook-paper storybook-paper-right">
    <div className="storybook-page-ornament" aria-hidden="true"><span>✦</span> ☼ <span>✦</span></div>
    <div className="storybook-copy">
      <span className="storybook-chapter">{scene.chapter}</span>
      <h1>{scene.title}</h1>
      <div className="storybook-paragraphs">{scene.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      {discovered && <p className="storybook-discovery">{scene.discovery}</p>}
      {page === lastPage && onDiscover && <Link className="storybook-play-link" to={paths.order(storyId)}>Jugar con este cuento <span aria-hidden="true">↗</span></Link>}
    </div>
    <div className="storybook-page-bottom" aria-hidden="true"><span>❧</span><span>{String(page + 1).padStart(2, '0')}</span></div>
    {onDiscover && <button type="button" className="storybook-text-touch" onClick={onDiscover}>{discovered ? 'Ocultar secreto' : 'Descubrir un secreto'} ✦</button>}
  </div>;
}

export function StoryBook({ story }: { story: Story }) {
  const root = useRef<HTMLDivElement>(null);
  const book = useRef<HTMLDivElement>(null);
  const leaf = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const didMount = useRef(false);
  const isMobile = useMediaQuery('(max-width: 1100px)');
  const [page, setPage] = useState(0);
  const [flip, setFlip] = useState<Flip | null>(null);
  const [discovered, setDiscovered] = useState(false);
  const storyBook = readerBooks[story.id];
  const scenes = storyBook.pages;
  const scene = scenes[page];
  const lastPage = scenes.length - 1;

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.timeline({ defaults: { ease: 'power2.out' } })
      .from('.storybook-art-window', { autoAlpha: 0, scale: 1.035, duration: 0.65 })
      .from('.storybook-copy > *', { autoAlpha: 0, y: 12, duration: 0.42, stagger: 0.065 }, '<0.12');
    gsap.to('.storybook-art-star', { scale: 1.28, autoAlpha: 0.55, duration: 1.8, ease: 'sine.inOut', stagger: 0.35, yoyo: true, repeat: -1 });
  }, { scope: root, dependencies: [page, isMobile], revertOnUpdate: true });

  useGSAP(() => {
    if (!flip || !leaf.current) return;
    gsap.timeline({ onComplete: () => { setPage(flip.target); setFlip(null); } })
      .to(leaf.current, { rotationY: flip.direction === 'forward' ? -180 : 180, duration: 1.05, ease: 'power2.inOut' });
  }, { scope: root, dependencies: [flip], revertOnUpdate: true });

  useGSAP(() => {
    if (!discovered || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.timeline({ defaults: { ease: 'back.out(1.7)' } })
      .from('.storybook-discovery', { autoAlpha: 0, y: 10, scale: 0.96, duration: 0.4 })
      .from('.storybook-art-magic', { autoAlpha: 0, scale: 0.5, duration: 0.55 }, '<');
  }, { scope: root, dependencies: [discovered, page], revertOnUpdate: true });

  const go = (next: number) => {
    if (next < 0 || next > lastPage || next === page || flip) return;
    setDiscovered(false);
    if (isMobile || window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPage(next);
    else setFlip({ direction: next > page ? 'forward' : 'backward', target: next });
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') { event.preventDefault(); go(page + 1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); go(page - 1); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [page, flip, isMobile]);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    if (!isMobile) return;
    root.current?.scrollIntoView({
      block: 'start',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }, [page, isMobile]);

  const toggleDiscovery = () => setDiscovered((value) => !value);
  const leftScene = flip?.direction === 'backward' ? scenes[flip.target] : scene;
  const rightScene = flip?.direction === 'forward' ? scenes[flip.target] : scene;

  return <div className="storybook-reader" ref={root} aria-label={story.title}>
    <div className="storybook-topbar"><BackButton to="/">Mapa</BackButton><span>{storyBook.shortTitle} · {page + 1} / {scenes.length}</span></div>
    <div className="storybook-stage"
      onTouchStart={(event) => { touchStart.current = { x: event.changedTouches[0].screenX, y: event.changedTouches[0].screenY }; }}
      onTouchEnd={(event) => {
        if (!touchStart.current) return;
        const dx = event.changedTouches[0].screenX - touchStart.current.x;
        const dy = event.changedTouches[0].screenY - touchStart.current.y;
        if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) go(page + (dx < 0 ? 1 : -1));
        touchStart.current = null;
      }}
    >
      <button type="button" className="storybook-arrow storybook-arrow-prev" onClick={() => go(page - 1)} disabled={page === 0 || !!flip} aria-label="Página anterior"><img src="/assets/cuentos/ui/flecha-izq.webp" alt="" /></button>
      <div className="storybook-book" ref={book}>
        <span className="storybook-book-corner storybook-book-corner-tl" aria-hidden="true" /><span className="storybook-book-corner storybook-book-corner-tr" aria-hidden="true" />
        <span className="storybook-book-corner storybook-book-corner-bl" aria-hidden="true" /><span className="storybook-book-corner storybook-book-corner-br" aria-hidden="true" />
        {isMobile ? <div className="storybook-mobile-spread"><IllustrationPage storyId={story.id} scene={scene} discovered={discovered} onDiscover={toggleDiscovery} /><TextPage storyId={story.id} scene={scene} page={page} lastPage={lastPage} discovered={discovered} onDiscover={toggleDiscovery} /></div> :
          <div className="storybook-spread">
            <IllustrationPage storyId={story.id} scene={leftScene} discovered={!flip && discovered} onDiscover={!flip ? toggleDiscovery : undefined} />
            <TextPage storyId={story.id} scene={rightScene} page={flip?.direction === 'forward' ? flip.target : page} lastPage={lastPage} discovered={!flip && discovered} onDiscover={!flip ? toggleDiscovery : undefined} />
            {flip && <div className={`storybook-leaf storybook-leaf-${flip.direction}`} ref={leaf} aria-hidden="true">
              <div className="storybook-leaf-face storybook-leaf-front">{flip.direction === 'forward' ? <TextPage storyId={story.id} scene={scene} page={page} lastPage={lastPage} /> : <IllustrationPage storyId={story.id} scene={scene} />}</div>
              <div className="storybook-leaf-face storybook-leaf-back">{flip.direction === 'forward' ? <IllustrationPage storyId={story.id} scene={scenes[flip.target]} /> : <TextPage storyId={story.id} scene={scenes[flip.target]} page={flip.target} lastPage={lastPage} />}</div>
            </div>}
          </div>}
        <div className="storybook-spine" aria-hidden="true" /><span className="storybook-book-charm" aria-hidden="true">✺</span>
      </div>
      <button type="button" className="storybook-arrow storybook-arrow-next" onClick={() => go(page + 1)} disabled={page === lastPage || !!flip} aria-label="Página siguiente"><img src="/assets/cuentos/ui/flecha-der.webp" alt="" /></button>
    </div>
    <div className="storybook-footer"><span>Desliza o usa las flechas para pasar de página</span><div className="storybook-dots" aria-label="Páginas del cuento">{scenes.map((item, index) => <button key={item.image} type="button" className={index === page ? 'is-active' : ''} aria-label={`Ir a la página ${index + 1}`} aria-current={index === page ? 'page' : undefined} onClick={() => go(index)} disabled={!!flip} />)}</div></div>
  </div>;
}
