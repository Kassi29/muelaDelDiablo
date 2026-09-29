// Los 5 cuentos: textos de los juegos y coordenadas (en % de la imagen) de los minijuegos.
// Las imágenes se derivan del id: public/assets/cuentos/<id>/ y public/assets/juegos/<id>/ (ver scripts/optimize-images.mjs).
import type { CharacterId } from '../../shared/characters';

export type StoryId = CharacterId;

export interface Spot {
  x: number;
  y: number;
}

export interface Story {
  id: StoryId;
  title: string;
  pageCount: number;
  /** Frases del juego "Cuenta cuentos", en el orden correcto. */
  order: string[];
  /** Diferencias entre las dos imágenes; radius es el área de acierto en %. */
  differences: (Spot & { radius: number })[];
  /** Juego de búsqueda: TODO(diseño) las coordenadas no coinciden con objetos reales del dibujo. */
  find: { label: string; emoji: string; spots: (Spot & { size: number })[] };
}

export const stories: Story[] = [
  {
    id: 'la-muela',
    title: 'La Muela del Diablo',
    pageCount: 4,
    order: [
      'Los diablos se reunieron en la noche para planear atacar a los dinosaurios.',
      'Los diablos salieron del infierno y atacaron con fuego y explosiones a los dinosaurios.',
      'La lucha se volvió encarnizada y los dinosaurios comenzaron a defenderse.',
      'Un valiente dinosaurito se aferró a la muela de un diablo y se la arrancó.',
      'El diablo huyó de dolor, los otros lo imitaron y nunca volvieron al lugar.',
    ],
    differences: [
      { x: 59, y: 58, radius: 7 },
      { x: 85, y: 46, radius: 7 },
      { x: 47, y: 18, radius: 7 },
      { x: 19, y: 13, radius: 7 },
      { x: 12, y: 43, radius: 7 },
    ],
    find: {
      label: 'Muelas del Diablo',
      emoji: '🦷',
      spots: [
        { x: 22, y: 40, size: 26 },
        { x: 65, y: 25, size: 22 },
        { x: 48, y: 70, size: 28 },
        { x: 82, y: 60, size: 20 },
        { x: 12, y: 80, size: 24 },
      ],
    },
  },
  {
    id: 'la-nina',
    title: 'La Niña y el Espejo',
    pageCount: 7,
    order: [
      'Los reyes encontraron a una niña pobre y feita desmayada en un campo de lechugas.',
      'Para ocultar la fealdad de la niña, los reyes mandaron destruir todos los espejos del reino.',
      'Los príncipes crecieron infelices con las mentiras y la princesa adoptada se volvió déspota.',
      'Un consejero sabio hizo traer al palacio a un niño que vendía espejos.',
      'La princesa se vio por primera vez, comprendió su injusticia y bajó a ayudar a la gente pobre.',
    ],
    differences: [
      { x: 74, y: 12, radius: 7 },
      { x: 37, y: 58, radius: 7 },
      { x: 34, y: 39, radius: 7 },
      { x: 63, y: 64, radius: 7 },
      { x: 71, y: 32, radius: 7 },
    ],
    find: {
      label: 'Espejos',
      emoji: '🪞',
      spots: [
        { x: 30, y: 68, size: 26 },
        { x: 75, y: 58, size: 22 },
        { x: 55, y: 85, size: 28 },
        { x: 18, y: 42, size: 20 },
        { x: 85, y: 32, size: 24 },
      ],
    },
  },
  {
    id: 'conejito-lloron',
    title: 'El Conejito Llorón',
    pageCount: 4,
    order: [
      'La familia de conejitos vivía feliz en un frondoso bosque.',
      'El papá regañaba al conejito diciéndole que los machos no lloran.',
      'Una liebre gigante secuestró a su hermanita y pidió zanahorias.',
      'El conejito lloró sin pena y de sus lágrimas brotaron zanahorias gigantes.',
      'La liebre se asustó y huyó, y todos celebraron al conejito llorón.',
    ],
    differences: [
      { x: 87, y: 9, radius: 7 },
      { x: 95, y: 76, radius: 7 },
      { x: 55, y: 94, radius: 7 },
      { x: 11, y: 50, radius: 7 },
      { x: 29, y: 14, radius: 7 },
    ],
    find: {
      label: 'Zanahorias',
      emoji: '🥕',
      spots: [
        { x: 28, y: 73, size: 28 },
        { x: 78, y: 64, size: 24 },
        { x: 52, y: 88, size: 30 },
        { x: 15, y: 45, size: 20 },
        { x: 88, y: 38, size: 22 },
      ],
    },
  },
  {
    id: 'quirquinchos',
    title: 'Los Quirquinchos de las Dunas de San Pedro',
    pageCount: 6,
    order: [
      'Los quirquinchitos escucharon a un padre y su hijo que querían atrapar uno para un charango.',
      'La familia de quirquinchitos discutió en secreto un plan para escapar del peligro.',
      'Los quirquinchitos asomaban la cabeza uno por uno haciendo correr al padre por todo el arenal.',
      'El padre cayó desmayado de agotamiento por tanto correr de un lado a otro.',
      'Los quirquinchitos ayudaron al padre a recuperarse y el niño prometió no molestar más animales.',
    ],
    differences: [
      { x: 50, y: 13, radius: 7 },
      { x: 50, y: 53, radius: 7 },
      { x: 48, y: 70, radius: 7 },
      { x: 66, y: 63, radius: 7 },
      { x: 45, y: 79, radius: 7 },
    ],
    find: {
      label: 'Quirquinchos',
      emoji: '🦔',
      spots: [
        { x: 25, y: 70, size: 26 },
        { x: 72, y: 60, size: 22 },
        { x: 50, y: 85, size: 28 },
        { x: 14, y: 48, size: 20 },
        { x: 86, y: 35, size: 24 },
      ],
    },
  },
  {
    id: 'tortugas',
    title: 'La Triste Historia de las Tortuguitas que Quisieron Llegar a la Luna',
    pageCount: 6,
    order: [
      'Un hombre sabio llegó a la ciudad y se hizo amigo de las cuatro tortuguitas.',
      'El sabio les dijo que si subían a la fuente en el ciclo lunar, los rayos de la luna las llevarían a ella.',
      'Las tortuguitas decidieron arriesgarse y comenzaron a subir la fuente, resbalando a cada paso.',
      'Las tortuguitas casi llegaron a la cima, pero los rayos de luna se fueron antes de alcanzarlas.',
      'Las tortuguitas quedaron petrificadas para siempre en la fuente con el cuello estirado hacia la luna.',
    ],
    differences: [
      { x: 52, y: 44, radius: 7 },
      { x: 50, y: 70, radius: 7 },
      { x: 78, y: 23, radius: 7 },
      { x: 74, y: 54, radius: 7 },
      { x: 12, y: 29, radius: 7 },
    ],
    find: {
      label: 'Tortuguitas',
      emoji: '🐢',
      spots: [
        { x: 28, y: 72, size: 26 },
        { x: 76, y: 62, size: 22 },
        { x: 50, y: 87, size: 30 },
        { x: 16, y: 44, size: 20 },
        { x: 87, y: 36, size: 24 },
      ],
    },
  },
];

export function findStory(id: string | null | undefined): Story | undefined {
  return stories.find((s) => s.id === id);
}

export const storyAssets = (id: StoryId) => ({
  cover: `/assets/cuentos/${id}/portada.webp`,
  openBook: `/assets/cuentos/${id}/libro-abierto.webp`,
  pergamino: `/assets/cuentos/${id}/pergamino.webp`,
  page: (n: number) => `/assets/cuentos/${id}/${n}.webp`,
  mapIcon: `/assets/home/mapa/${id}.webp`,
  mapIconGlow: `/assets/home/mapa/${id}-brillo.webp`,
  gameCard: `/assets/home/cartas/${id}.webp`,
  differencesNormal: `/assets/juegos/${id}/diferencias-normal.webp`,
  differencesChanged: `/assets/juegos/${id}/diferencias-cambios.webp`,
  findImage: `/assets/juegos/${id}/buscar.webp`,
});
