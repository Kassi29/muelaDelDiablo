import { useState, type CSSProperties } from 'react';
import { ActivityLayout, GoHome, WinBanner, useStoryParam } from '../../components/ActivityLayout';
import { storyAssets, type Story } from '../../data/stories';
import { paths } from '../../paths';

export function FindGame() {
  const story = useStoryParam();
  return story ? <FindBoard key={story.id} story={story} /> : <GoHome />;
}

function FindBoard({ story }: { story: Story }) {
  const [found, setFound] = useState<number[]>([]);
  const [rotations] = useState(() => story.find.spots.map(() => Math.round(Math.random() * 360)));
  const { label, emoji, spots } = story.find;
  const won = found.length === spots.length;

  return (
    <ActivityLayout
      variant="find"
      titleImage="/assets/juegos/ui/titulo-buscar.webp"
      titleAlt="La búsqueda mágica"
      instructions={
        <>
          Busca y toca los {spots.length} {label} escondidos en la imagen.{' '}
          <span className="game-score">
            {label}: {found.length} / {spots.length}
          </span>
        </>
      }
      back={{ to: paths.differences(story.id), label: 'Atrás' }}
      won={won}
    >
      <div className="wood-board">
        <div className="find-board">
          <img src={storyAssets(story.id).findImage} alt="Imagen para buscar" width={1400} height={1400} draggable={false} />
          {spots.map((spot, i) => (
            <button
              key={i}
              type="button"
              className={`find-item${found.includes(i) ? ' is-found' : ''}`}
              style={{ left: `${spot.x}%`, top: `${spot.y}%`, fontSize: spot.size, '--rot': `${rotations[i]}deg` } as CSSProperties}
              disabled={found.includes(i)}
              onClick={() => setFound((f) => [...f, i])}
              aria-label={`${label} escondido`}
            >
              {emoji}
            </button>
          ))}
        </div>
        {won && <WinBanner next={paths.chat} />}
      </div>
    </ActivityLayout>
  );
}
