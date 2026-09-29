import { Link } from 'react-router';
import { stories, storyAssets } from '../data/stories';
import { paths } from '../paths';
import '../styles/home.css';

export function Home() {
  return (
    <div className="home">
      <section id="seccion-cuentos" className="home-section">
        <img src="/assets/home/titulo-cuentos.webp" alt="¡Elige tu aventura!" className="home-title" width={1200} height={300} />
        <div className="map">
          <img
            src="/assets/home/mapa.webp"
            srcSet="/assets/home/mapa-1200w.webp 1200w, /assets/home/mapa.webp 2400w"
            sizes="(max-width: 800px) 100vw, 760px"
            alt="Mapa de los cuentos"
            className="map-bg"
            width={2400}
            height={1800}
          />
          {stories.map((story) => {
            const assets = storyAssets(story.id);
            return (
              <Link key={story.id} to={paths.story(story.id)} className={`map-spot map-spot-${story.id}`} title={story.title}>
                <img src={assets.mapIcon} alt={story.title} className="map-spot-normal" width={800} height={800} />
                <img src={assets.mapIconGlow} alt="" className="map-spot-glow" width={800} height={800} loading="lazy" />
              </Link>
            );
          })}
        </div>
      </section>

      <section id="seccion-juegos" className="home-section">
        <img src="/assets/home/titulo-juegos.webp" alt="¡Diviértete jugando!" className="home-title" width={1200} height={300} loading="lazy" />
        <div className="games-table">
          <img
            src="/assets/home/juegos-fondo.webp"
            srcSet="/assets/home/juegos-fondo-1200w.webp 1200w, /assets/home/juegos-fondo.webp 2400w"
            sizes="(max-width: 800px) 100vw, 760px"
            alt=""
            className="games-table-bg"
            width={2400}
            height={1800}
            loading="lazy"
          />
          {stories.map((story) => (
            <Link key={story.id} to={paths.order(story.id)} className={`game-card game-card-${story.id}`} title={`Juegos: ${story.title}`}>
              <img src={storyAssets(story.id).gameCard} alt={`Juegos de ${story.title}`} width={600} height={600} loading="lazy" />
            </Link>
          ))}
        </div>
      </section>

      <section id="seccion-chats" className="home-section home-section-chats">
        <Link to={paths.chat} className="chats-sign">
          <img
            src="/assets/home/cartel-chats.webp"
            alt="¡Tienes 5 chats sin leer! Toca para chatear con los personajes"
            width={1400}
            height={496}
            loading="lazy"
          />
        </Link>
      </section>
    </div>
  );
}
