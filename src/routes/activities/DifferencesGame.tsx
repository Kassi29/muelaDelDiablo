import { useState, type MouseEvent } from 'react';
import { ActivityLayout, GoHome, WinBanner, useStoryParam } from '../../components/ActivityLayout';
import { storyAssets, type Story } from '../../data/stories';
import { paths } from '../../paths';

export function DifferencesGame() {
  const story = useStoryParam();
  return story ? <DifferencesBoard key={story.id} story={story} /> : <GoHome />;
}

type Pane = 'normal' | 'cambios';

function DifferencesBoard({ story }: { story: Story }) {
  const [found, setFound] = useState<number[]>([]);
  // Contador de fallos por imagen: cambia la key del panel para repetir el destello rojo.
  const [misses, setMisses] = useState<Record<Pane, number>>({ normal: 0, cambios: 0 });
  const total = story.differences.length;
  const won = found.length === total;
  const assets = storyAssets(story.id);

  const onPaneClick = (e: MouseEvent<HTMLDivElement>, pane: Pane) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const hit = story.differences.findIndex((d, i) => !found.includes(i) && Math.hypot(x - d.x, y - d.y) <= d.radius);
    if (hit >= 0) setFound((f) => [...f, hit]);
    else setMisses((m) => ({ ...m, [pane]: m[pane] + 1 }));
  };

  const renderPane = (pane: Pane, src: string, alt: string) => (
    <div className="diff-frame">
      <div key={misses[pane]} className={`diff-pane${misses[pane] ? ' is-miss' : ''}`} onClick={(e) => onPaneClick(e, pane)}>
        <img src={src} alt={alt} width={1000} height={1000} draggable={false} />
        {story.differences.map((d, i) =>
          found.includes(i) ? (
            <span key={i} className="diff-marker" style={{ left: `${d.x}%`, top: `${d.y}%` }} />
          ) : (
            <span key={i} className="diff-target" style={{ left: `${d.x}%`, top: `${d.y}%`, width: `${d.radius * 2}%` }} />
          ),
        )}
      </div>
    </div>
  );

  return (
    <ActivityLayout
      variant="differences"
      titleImage="/assets/juegos/ui/titulo-diferencias.webp"
      titleAlt="Espejo roto"
      instructions={
        <>
          Compara las dos imágenes y toca las {total} diferencias.{' '}
          <span className="game-score">
            Encontradas: {found.length} / {total}
          </span>
        </>
      }
      back={{ to: paths.order(story.id), label: 'Atrás' }}
      next={paths.find(story.id)}
      won={won}
    >
      <div className="diff-frames">
        {renderPane('normal', assets.differencesNormal, 'Imagen original')}
        {renderPane('cambios', assets.differencesChanged, 'Imagen con cambios')}
        {won && <WinBanner next={paths.find(story.id)} />}
      </div>
    </ActivityLayout>
  );
}
