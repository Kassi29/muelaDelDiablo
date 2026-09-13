import fs from 'fs';
import path from 'path';

const dirs = [
  'public/images/covers',
  'public/images/pages',
  'public/images/differences',
  'public/images/hidden',
  'public/images/characters'
];

// Crear directorios de assets si no existen
dirs.forEach(dir => {
  const fullPath = path.resolve(dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`📁 Carpeta creada: ${dir}`);
  }
});

// Generar SVGs por defecto para que el prototipo cargue sin errores
const defaultSVGs = {
  'public/images/covers/conejito-cover.png': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 550" width="100%" height="100%">
    <rect width="400" height="550" fill="#F2BB4B"/>
    <circle cx="200" cy="220" r="110" fill="#FFF8E7"/>
    <!-- Orejas -->
    <ellipse cx="160" cy="90" rx="30" ry="80" fill="#FFF8E7" transform="rotate(-15, 160, 90)"/>
    <ellipse cx="160" cy="90" rx="15" ry="60" fill="#F26671" transform="rotate(-15, 160, 90)"/>
    <ellipse cx="240" cy="90" rx="30" ry="80" fill="#FFF8E7" transform="rotate(15, 240, 90)"/>
    <ellipse cx="240" cy="90" rx="15" ry="60" fill="#F26671" transform="rotate(15, 240, 90)"/>
    <!-- Cara del conejito -->
    <ellipse cx="200" cy="220" rx="75" ry="65" fill="#FFF8E7"/>
    <!-- Ojos tristes (llorando) -->
    <path d="M 170 210 Q 180 200 185 210" stroke="#3D2B1F" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M 215 210 Q 220 200 230 210" stroke="#3D2B1F" stroke-width="5" fill="none" stroke-linecap="round"/>
    <!-- Lágrimas -->
    <circle cx="172" cy="225" r="10" fill="#547398"/>
    <path d="M 172 225 L 172 245 C 172 250 168 250 168 245 Z" fill="#547398"/>
    <circle cx="228" cy="225" r="8" fill="#547398"/>
    <!-- Nariz -->
    <polygon points="190,230 210,230 200,240" fill="#F26671"/>
    <!-- Boca -->
    <path d="M 195 246 Q 200 250 205 246" stroke="#3D2B1F" stroke-width="3" fill="none"/>
    <!-- Título -->
    <rect x="30" y="380" width="340" height="120" rx="20" fill="#FFFFFF" stroke="#748A63" stroke-width="6"/>
    <text x="200" y="430" font-family="'Fredoka', sans-serif" font-weight="bold" font-size="28" fill="#F26671" text-anchor="middle">EL CONEJITO</text>
    <text x="200" y="475" font-family="'Fredoka', sans-serif" font-weight="bold" font-size="34" fill="#547398" text-anchor="middle">LLORÓN 💧</text>
  </svg>`,
  
  'public/images/characters/conejito-avatar.png': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
    <circle cx="50" cy="50" r="50" fill="#F2D194"/>
    <!-- Orejas -->
    <ellipse cx="40" cy="25" rx="10" ry="25" fill="#FFF8E7" transform="rotate(-10, 40, 25)"/>
    <ellipse cx="40" cy="25" rx="5" ry="18" fill="#F26671" transform="rotate(-10, 40, 25)"/>
    <ellipse cx="60" cy="25" rx="10" ry="25" fill="#FFF8E7" transform="rotate(10, 60, 25)"/>
    <ellipse cx="60" cy="25" rx="5" ry="18" fill="#F26671" transform="rotate(10, 60, 25)"/>
    <!-- Cara conejito -->
    <circle cx="50" cy="62" r="28" fill="#FFF8E7"/>
    <!-- Ojos tristes -->
    <path d="M 40 58 Q 44 54 46 58" stroke="#3D2B1F" stroke-width="3" fill="none"/>
    <path d="M 54 58 Q 56 54 60 58" stroke="#3D2B1F" stroke-width="3" fill="none"/>
    <circle cx="41" cy="64" r="4" fill="#547398"/>
    <!-- Nariz -->
    <polygon points="47,65 53,65 50,69" fill="#F26671"/>
  </svg>`,

  'public/images/pages/conejito-p1.png': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%">
    <rect width="600" height="800" fill="#FFF8F0"/>
    <rect x="20" y="20" width="560" height="760" rx="20" fill="none" stroke="#748A63" stroke-width="8"/>
    <!-- Bosque background -->
    <circle cx="100" cy="500" r="250" fill="#748A63" opacity="0.3"/>
    <circle cx="500" cy="520" r="220" fill="#748A63" opacity="0.3"/>
    <!-- Sol -->
    <circle cx="500" cy="120" r="60" fill="#F2BB4B" opacity="0.6"/>
    
    <!-- Texto ilustrativo de la página física -->
    <text x="300" y="100" font-family="'Fredoka', sans-serif" font-size="28" fill="#3D2B1F" text-anchor="middle" font-weight="bold">Página 1: La Familia Conejo</text>
    
    <!-- Cuadro de texto simulado de libro -->
    <rect x="50" y="550" width="500" height="200" rx="15" fill="#FFFFFF" stroke="#E6DCD0" stroke-width="4"/>
    <text x="80" y="590" font-family="'Nunito', sans-serif" font-size="20" fill="#3D2B1F">Había una vez un conejito que vivía con sus</text>
    <text x="80" y="625" font-family="'Nunito', sans-serif" font-size="20" fill="#3D2B1F">papás conejos y sus hermanitas en un hermoso</text>
    <text x="80" y="660" font-family="'Nunito', sans-serif" font-size="20" fill="#3D2B1F">bosque. Eran muy unidos. Papá Conejo era</text>
    <text x="80" y="695" font-family="'Nunito', sans-serif" font-size="20" fill="#3D2B1F">grande, regordete y llevaba lentes de profesor.</text>
    
    <!-- Dibujo de la familia conejito -->
    <!-- Papá conejo -->
    <ellipse cx="220" cy="380" rx="55" ry="70" fill="#FFF8E7" stroke="#3D2B1F" stroke-width="3"/>
    <circle cx="200" cy="340" r="8" fill="none" stroke="#3D2B1F" stroke-width="4"/>
    <circle cx="240" cy="340" r="8" fill="none" stroke="#3D2B1F" stroke-width="4"/>
    <line x1="208" y1="340" x2="232" y2="340" stroke="#3D2B1F" stroke-width="3"/>
    
    <!-- Mamá coneja -->
    <ellipse cx="360" cy="400" rx="45" ry="60" fill="#FFF8E7" stroke="#3D2B1F" stroke-width="3"/>
    <path d="M 335 370 Q 360 360 385 370" stroke="#F26671" stroke-width="5" fill="none"/>
  </svg>`,

  'public/images/pages/conejito-p2.png': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%">
    <rect width="600" height="800" fill="#FFF8F0"/>
    <rect x="20" y="20" width="560" height="760" rx="20" fill="none" stroke="#F28157" stroke-width="8"/>
    
    <text x="300" y="100" font-family="'Fredoka', sans-serif" font-size="28" fill="#3D2B1F" text-anchor="middle" font-weight="bold">Página 2: Los Conejos no lloran</text>
    
    <rect x="50" y="550" width="500" height="200" rx="15" fill="#FFFFFF" stroke="#E6DCD0" stroke-width="4"/>
    <text x="80" y="590" font-family="'Nunito', sans-serif" font-size="20" fill="#3D2B1F">El conejito sufría porque cuando sus hermanitas</text>
    <text x="80" y="625" font-family="'Nunito', sans-serif" font-size="20" fill="#3D2B1F">lloraban, sus papás las consolaban. Pero si él</text>
    <text x="80" y="660" font-family="'Nunito', sans-serif" font-size="20" fill="#3D2B1F">lloraba, su papá se enojaba y le decía:</text>
    <text x="80" y="695" font-family="'Nunito', sans-serif" font-size="22" fill="#F26671" font-weight="bold">"¡Qué vergüenza! ¡Los conejos machos no lloran!"</text>

    <!-- Conejito triste y papá conejo regañando -->
    <ellipse cx="400" cy="350" rx="50" ry="60" fill="#FFF8E7" stroke="#3D2B1F" stroke-width="3"/>
    <text x="400" y="320" font-size="30" text-anchor="middle">😡</text>
    <ellipse cx="200" cy="400" rx="35" ry="40" fill="#FFF8E7" stroke="#3D2B1F" stroke-width="3"/>
    <text x="200" y="390" font-size="24" text-anchor="middle">😢💧</text>
  </svg>`,

  'public/images/pages/conejito-p3.png': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%">
    <rect width="600" height="800" fill="#FFF8F0"/>
    <rect x="20" y="20" width="560" height="760" rx="20" fill="none" stroke="#547398" stroke-width="8"/>
    
    <text x="300" y="100" font-family="'Fredoka', sans-serif" font-size="28" fill="#3D2B1F" text-anchor="middle" font-weight="bold">Página 3: ¡Aparece la Liebre!</text>
    
    <rect x="50" y="550" width="500" height="200" rx="15" fill="#FFFFFF" stroke="#E6DCD0" stroke-width="4"/>
    <text x="80" y="590" font-family="'Nunito', sans-serif" font-size="20" fill="#3D2B1F">Un día, una liebre inmensa y feroz apareció</text>
    <text x="80" y="625" font-family="'Nunito', sans-serif" font-size="20" fill="#3D2B1F">y se apoderó de una de las hermanitas.</text>
    <text x="80" y="660" font-family="'Nunito', sans-serif" font-size="22" fill="#F28157" font-weight="bold">"Les devolveré a su hija si me traen cinco</text>
    <text x="80" y="695" font-family="'Nunito', sans-serif" font-size="22" fill="#F28157" font-weight="bold">sacos llenos de zanahorias", rugió con fuerza.</text>

    <!-- Liebre malvada -->
    <ellipse cx="300" cy="350" rx="70" ry="90" fill="#7A6B5D" stroke="#3D2B1F" stroke-width="3"/>
    <text x="300" y="340" font-size="50" text-anchor="middle">😈</text>
    <text x="220" y="430" font-size="30">🐰</text>
  </svg>`,

  'public/images/pages/conejito-p4.png': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%">
    <rect width="600" height="800" fill="#FFF8F0"/>
    <rect x="20" y="20" width="560" height="760" rx="20" fill="none" stroke="#F2BB4B" stroke-width="8"/>
    
    <text x="300" y="100" font-family="'Fredoka', sans-serif" font-size="28" fill="#3D2B1F" text-anchor="middle" font-weight="bold">Página 4: ¡Zanahorias Mágicas!</text>
    
    <rect x="50" y="550" width="500" height="200" rx="15" fill="#FFFFFF" stroke="#E6DCD0" stroke-width="4"/>
    <text x="80" y="590" font-family="'Nunito', sans-serif" font-size="20" fill="#3D2B1F">El conejito se puso a llorar sin pena. ¡Y donde</text>
    <text x="80" y="625" font-family="'Nunito', sans-serif" font-size="20" fill="#3D2B1F">caían sus lágrimas, empezaron a crecer zanahorias!</text>
    <text x="80" y="660" font-family="'Nunito', sans-serif" font-size="20" fill="#3D2B1F">Tantas que la liebre huyó asustada. Su papá</text>
    <text x="80" y="695" font-family="'Nunito', sans-serif" font-size="20" fill="#748A63" font-weight="bold">le pidió disculpas: ¡llorar es maravilloso!</text>

    <!-- Conejito llorando y zanahorias brotando -->
    <ellipse cx="200" cy="380" rx="40" ry="45" fill="#FFF8E7" stroke="#3D2B1F" stroke-width="3"/>
    <text x="200" y="375" font-size="30" text-anchor="middle">😭</text>
    <text x="160" y="420" font-size="40">💧</text>
    <text x="240" y="420" font-size="40">💧</text>
    
    <!-- Zanahorias creciendo -->
    <text x="380" y="400" font-size="60">🥕</text>
    <text x="450" y="370" font-size="80">🥕</text>
    <text x="320" y="430" font-size="50">🥕</text>
  </svg>`
};

// Guardar los SVGs como archivos .png (Vite y los navegadores soportan cargar imágenes SVG)
// Nota: para simplificar en el servidor de desarrollo, guardamos el SVG y renombramos el archivo.
// Dado que guardarlos como SVG es mejor y más limpio, vamos a guardarlos como .svg y modificar
// storiesData en stories.js para cargar los SVGs en lugar de PNGs. 
// Esto asegura que la aplicación cargue hermosos vectores nítidos e interactivos en cualquier pantalla.

Object.entries(defaultSVGs).forEach(([filePath, svgContent]) => {
  // Cambiar extensión a .svg
  const svgPath = filePath.replace('.png', '.svg');
  fs.writeFileSync(svgPath, svgContent);
  console.log(`✅ Asset creado: ${svgPath}`);
});

console.log("🚀 Todos los assets vectoriales iniciales listos para la aplicación.");
