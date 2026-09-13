import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

// Copia automática de assets desde 'PÁGINA WEB' hacia 'public/assets' al iniciar Vite
function copyRealAssets() {
  const baseDir = process.cwd();
  const srcBase = path.join(baseDir, 'PÁGINA WEB');
  const destBase = path.join(baseDir, 'public', 'assets');

  if (!fs.existsSync(srcBase)) return;

  const dirs = [
    destBase,
    path.join(destBase, 'mapa'),
    path.join(destBase, 'juegos'),
  ];
  dirs.forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  const copies = [
    ['00. FONDO/FONDO CIELO.png.svg', 'fondo-cielo.svg'],
    ['01. CARTEL PRINCIPAL/BANNER PÁGINA FINAL.png.svg', 'banner-principal.svg'],
    ['02. NAVBAR/NAVBAR.svg', 'navbar.svg'],
    ['03. SELECCIÓN CUENTOS/MAPA/MAPA ELECCIÓN CUENTOS.png', 'mapa-cuentos.png'],
    ['03. SELECCIÓN CUENTOS/LUGARES MAPA/SIN BRILLO/SB BOSQUE.svg', 'mapa/sb-bosque.svg'],
    ['03. SELECCIÓN CUENTOS/LUGARES MAPA/SIN BRILLO/SB CASTILLO.svg', 'mapa/sb-castillo.svg'],
    ['03. SELECCIÓN CUENTOS/LUGARES MAPA/SIN BRILLO/SB FUENTE.svg', 'mapa/sb-fuente.svg'],
    ['03. SELECCIÓN CUENTOS/LUGARES MAPA/SIN BRILLO/SB MUELA.svg', 'mapa/sb-muela.svg'],
    ['03. SELECCIÓN CUENTOS/LUGARES MAPA/SIN BRILLO/SB QUIRQUINCHOS.svg', 'mapa/sb-quirquinchos.svg'],
    ['03. SELECCIÓN CUENTOS/LUGARES MAPA/CON BRILLO/CB BOSQUE.svg', 'mapa/cb-bosque.svg'],
    ['03. SELECCIÓN CUENTOS/LUGARES MAPA/CON BRILLO/CB CASTILLO.svg', 'mapa/cb-castillo.svg'],
    ['03. SELECCIÓN CUENTOS/LUGARES MAPA/CON BRILLO/CB FUENTE.svg', 'mapa/cb-fuente.svg'],
    ['03. SELECCIÓN CUENTOS/LUGARES MAPA/CON BRILLO/CB MUELA.svg', 'mapa/cb-muela.svg'],
    ['03. SELECCIÓN CUENTOS/LUGARES MAPA/CON BRILLO/CB QUIRQUINCHOS.svg', 'mapa/cb-quirquinchos.svg'],
    ['04. SELECCIÓN JUEGOS/FONOD UEGOS/ELECCIÓN JUEGOS FONDO.png', 'juegos-fondo.png'],
    ['04. SELECCIÓN JUEGOS/PORTADA JUEGOS/EL CONEJITO LLORÓN.svg', 'juegos/conejito.svg'],
    ['04. SELECCIÓN JUEGOS/PORTADA JUEGOS/LA MUELA DEL DIABLO.svg', 'juegos/la-muela.svg'],
    ['04. SELECCIÓN JUEGOS/PORTADA JUEGOS/LA NIÑA Y EL ESPEJO.svg', 'juegos/la-nina.svg'],
    ['04. SELECCIÓN JUEGOS/PORTADA JUEGOS/QUIRQUINCHO.svg', 'juegos/quirquincho.svg'],
    ['04. SELECCIÓN JUEGOS/PORTADA JUEGOS/TORTUGAS.svg', 'juegos/tortugas.svg'],
    ['05. CARTEL CHATS/CARTEL CHATS.svg', 'cartel-chats.svg']
  ];

  copies.forEach(([rel, dest]) => {
    const srcFile = path.join(srcBase, rel);
    const destFile = path.join(destBase, dest);
    try {
      if (fs.existsSync(srcFile)) {
        fs.copyFileSync(srcFile, destFile);
      }
    } catch (e) {
      console.error('Error copying asset:', rel, e);
    }
  });
}

copyRealAssets();

export default defineConfig({
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
});
