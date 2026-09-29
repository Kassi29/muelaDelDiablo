// Genera public/assets optimizados (WebP redimensionado) a partir de los originales del diseñador.
// Uso: npm run optimize:images   (ASSETS_SRC=ruta/a/originales para cambiar la carpeta fuente)
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.resolve(process.env.ASSETS_SRC ?? path.join(ROOT, '..', 'muela-assets-src', 'assets'));
const OUT = path.join(ROOT, 'public', 'assets');

// [origen relativo a SRC, destino relativo a OUT (sin extensión), ancho máximo, opciones]
const STORIES = [
  // id, carpeta de páginas, nº páginas, portada, libro abierto, pergamino, icono mapa, carta juego, sufijo juegos, nombre "encuentra"
  ['la-muela', 'La Muela del Diablo', 4, 'MUELA DEL DIABLO', 'LA muela', 'la muela del diablo', 'muela', 'la-muela', 'muela', 'MUELA'],
  ['la-nina', 'La ninia y el espejo', 7, 'LA NIÑA Y EL ESPEJO', 'la niña', 'la niña y el espejo', 'castillo', 'la-nina', 'niña', 'NIÑA'],
  ['conejito-lloron', 'El conejito lloron', 4, 'CONEJITO LLORÓN', 'el conejo', 'el conejito lloroon', 'bosque', 'conejito', 'conejo', 'CONEJITO'],
  ['quirquinchos', 'Los quirquinchos de las dunas de San Pedro', 6, 'QUIRQUINCHOS', 'quirtquinchos', 'quirquinchos', 'quirquinchos', 'quirquincho', 'quirquincho', 'QUIRQUINCHO'],
  ['tortugas', 'La triste historia de las tortuguitas que quisieron llegar a la luna', 6, 'TORTUGAS', 'tortugasd', 'tortugas', 'fuente', 'tortugas', 'tortugas', 'TORTUGAS'],
];

const UI = 'cuentos/Elementos p[agina cuentos';
const JUEGOS_UI = 'juegos/juegos elementos pag';

const jobs = [
  // Global
  ['banner-pagina-final.png', 'ui/banner', 2000],
  ['navbar.png', 'ui/navbar', 1600],
  ['fondo-cielo.png', 'ui/fondo-cielo', 1700],
  ['boton retroceder.png', 'ui/boton-atras', 400],
  ['juegos/flecha siguiente activdad.png', 'ui/flecha-siguiente', 400],
  ['mouse/CURSOR NORMAL.svg', 'ui/cursor', 48, { format: 'png' }],
  ['mouse/CURSOR CLICK.svg', 'ui/cursor-click', 48, { format: 'png' }],
  ['logo pagina.svg', 'ui/logo', 512, { format: 'png' }],

  // Home
  ['mapa-cuentos.png', 'home/mapa', 2400, { mobile: 1200 }],
  ['juegos-fondo.png', 'home/juegos-fondo', 2400, { mobile: 1200 }],
  ['cartel-chats.png', 'home/cartel-chats', 1400],
  ['Papiros nombres/Slección cuentos.png', 'home/titulo-cuentos', 1200],
  ['Papiros nombres/Slección juegos.png', 'home/titulo-juegos', 1200],

  // Lector
  [`${UI}/BOTÓN EMPEZAR LECTIRA.png`, 'cuentos/ui/boton-empezar', 600],
  [`${UI}/BOTÓN IZQ.png`, 'cuentos/ui/flecha-izq', 300],
  [`${UI}/BOTÓN DER.png`, 'cuentos/ui/flecha-der', 300],

  // Juegos (UI)
  [`${JUEGOS_UI}/cuenta cuentos.png`, 'juegos/ui/titulo-ordenar', 1200],
  [`${JUEGOS_UI}/espejo roto.png`, 'juegos/ui/titulo-diferencias', 1200],
  [`${JUEGOS_UI}/la b'usqueda m'agica.png`, 'juegos/ui/titulo-buscar', 1200],
  [`${JUEGOS_UI}/bien hecho (1).png`, 'juegos/ui/bien-hecho', 1200],
  [`${JUEGOS_UI}/BOTÓN REVISAR RESULTADO.png`, 'juegos/ui/boton-revisar', 500],
  [`${JUEGOS_UI}/Madera grande.png`, 'juegos/ui/madera', 1600],

  // Chat
  ['chats/chats antes.png', 'chats/fondo-lista', 2400, { mobile: 1200 }],
  ['chats/chats dentro.png', 'chats/fondo-chat', 2400, { mobile: 1200 }],
  ['chats/chats verticales/CHATS vertical.png', 'chats/fondo-lista-movil', 1000],
  ['chats/chats verticales/CHATS vertical 2.png', 'chats/fondo-chat-movil', 1000],
  ['chats/fotos perfil/muela del diablo.png', 'chats/avatares/la-muela', 256],
  ['chats/fotos perfil/la niña y el espejo.png', 'chats/avatares/la-nina', 256],
  ['chats/fotos perfil/conejito.png', 'chats/avatares/conejito-lloron', 256],
  ['chats/fotos perfil/quirquinchos.png', 'chats/avatares/quirquinchos', 256],
  ['chats/fotos perfil/tortugas.png', 'chats/avatares/tortugas', 256],
];

for (const [id, folder, pages, cover, openBook, pergamino, mapIcon, card, diff, find] of STORIES) {
  for (let n = 1; n <= pages; n++) jobs.push([`cuentos/${folder}/${n}.png`, `cuentos/${id}/${n}`, 1000]);
  jobs.push(
    [`${UI}/portadas LIBROs FINAL/${cover}.svg`, `cuentos/${id}/portada`, 1000],
    [`${UI}/Libros abiertos/LIBRO ABIERTO ${openBook}.png`, `cuentos/${id}/libro-abierto`, 2000],
    [`Papiros nombres/pergamino ${pergamino}.png`, `cuentos/${id}/pergamino`, 1200],
    [`mapa/sb-${mapIcon}.svg`, `home/mapa/${id}`, 800],
    [`mapa/cb-${mapIcon}.svg`, `home/mapa/${id}-brillo`, 800],
    [`juegos/${card}.svg`, `home/cartas/${id}`, 600],
    [`juegos/ENCUENTRA DIFERENCIAS/diferencias ${diff} normal.png`, `juegos/${id}/diferencias-normal`, 1000],
    [`juegos/ENCUENTRA DIFERENCIAS/diferencias ${diff} cambios.png`, `juegos/${id}/diferencias-cambios`, 1000],
    [`juegos/ENCUENTRA LOS OBJETOS/ENCUENTRA ${find}.png`, `juegos/${id}/buscar`, 1400],
  );
}

// Los SVG del diseñador son PNG embebidos; algunos usan el MIME inválido "img/png" y tamaños
// intrínsecos distintos del viewBox (los cursores). Se normalizan antes de rasterizar.
async function readInput(file) {
  const buf = await fs.readFile(file);
  if (!file.endsWith('.svg')) return buf;
  let svg = buf.toString('utf8').replaceAll('data:img/png', 'data:image/png');
  const vb = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  if (vb) {
    svg = svg.replace(/<svg([^>]*?)\swidth="[^"]*"/, `<svg$1 width="${vb[1]}"`)
      .replace(/<svg([^>]*?)\sheight="[^"]*"/, `<svg$1 height="${vb[2]}"`);
  }
  return Buffer.from(svg);
}

async function render(input, dest, width, format) {
  const pipeline = sharp(input, { limitInputPixels: false }).resize({ width, withoutEnlargement: true });
  const out = format === 'png' ? pipeline.png({ compressionLevel: 9, palette: true }) : pipeline.webp({ quality: 80, effort: 6 });
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await out.toFile(dest);
  return (await fs.stat(dest)).size;
}

await fs.rm(OUT, { recursive: true, force: true });
let total = 0;
const missing = [];
for (const [src, dest, width, opts = {}] of jobs) {
  const file = path.join(SRC, src);
  try {
    await fs.access(file);
  } catch {
    missing.push(src);
    continue;
  }
  const input = await readInput(file);
  const ext = opts.format === 'png' ? 'png' : 'webp';
  total += await render(input, path.join(OUT, `${dest}.${ext}`), width, opts.format);
  if (opts.mobile) total += await render(input, path.join(OUT, `${dest}-${opts.mobile}w.${ext}`), opts.mobile, opts.format);
}

console.log(`✔ ${jobs.length - missing.length} imágenes → public/assets (${(total / 1024 / 1024).toFixed(1)} MB)`);
if (missing.length) {
  console.error(`✘ No se encontraron ${missing.length} originales en ${SRC}:\n  ${missing.join('\n  ')}`);
  process.exit(1);
}
