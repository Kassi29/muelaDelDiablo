# 📚 La Muela del Diablo y Otros

Plataforma interactiva infantil (diseñada para niños de 9-10 años) basada en el cuento **El Conejito Llorón**. Los niños pueden leer la historia en un formato interactivo de páginas, jugar retos divertidos relacionados con la trama y chatear con el Conejito Llorón usando Inteligencia Artificial.

---

## 🎨 Características Principales

1. **Lectura Interactiva**: Lector estilo libro físico con navegación por flechas grandes y 4 páginas ilustradas vectoriales de alta definición.
2. **Tres Actividades Educativas**:
   - **Ordenar la Historia**: Arrastrar y colocar los sucesos del cuento en orden cronológico.
   - **Encuentra Diferencias**: Comparar dos imágenes similares y encontrar los cambios (MVP implementado listo para recibir tus ilustraciones finales).
   - **Encuentra las Zanahorias**: Buscar y recolectar las zanahorias escondidas en la escena del bosque.
3. **Chat con el Conejito Llorón (IA)**:
   - Impulsado por la API de **Google Gemini**.
   - El Conejito tiene un comportamiento estructurado: es dulce, family-friendly, responde basándose estrictamente en el contenido de su cuento y jamás sale de su rol.
   - Cuenta con **modo simulado offline** si no configuras una API key.

---

## 🛠️ Requisitos Previos

- **Node.js** (versión 18 o superior)
- **NPM** (incluido con Node.js)

---

## 🚀 Instrucciones de Configuración y Ejecución

Sigue estos sencillos pasos para levantar el proyecto localmente:

### 1. Instalar Dependencias
Abre tu terminal en la carpeta raíz del proyecto (`c:\workspace\natata`) y ejecuta:
```bash
npm install
```

### 2. Generar las Ilustraciones Vectoriales
Hemos creado un script que genera automáticamente las carpetas de recursos y crea hermosas ilustraciones vectoriales (SVG) para todas las páginas del libro y del juego. Ejecútalo corriendo:
```bash
node copy-assets.js
```

### 3. Configurar la API Key de Gemini
1. Crea un archivo llamado `.env` en la raíz del proyecto (puedes copiar el archivo `.env.example`):
   ```bash
   cp .env.example .env
   ```
2. Abre el archivo `.env` y coloca tu API Key de Google Gemini en la variable `GEMINI_API_KEY`:
   ```env
   GEMINI_API_KEY=tu_clave_api_aqui
   ```
   *Nota: Si no agregas la API key, el chat funcionará de todas maneras usando respuestas de simulación offline para que puedas probar el juego sin problemas.*

### 4. Iniciar la Aplicación
Para ejecutar el servidor frontend de desarrollo (Vite) y el servidor backend de chat (Express) al mismo tiempo, solo corre:
```bash
npm start
```

- La interfaz interactiva se abrirá en tu navegador en: [http://localhost:5173](http://localhost:5173)
- El backend del chat de IA correrá en: [http://localhost:3000](http://localhost:3000)

---

## 🎨 Personalización del Diseño (Colores)

La paleta de colores del proyecto se rige por un **Design System** configurable mediante variables CSS. Si deseas cambiar el aspecto estético, solo debes modificar los tokens en el archivo:

👉 `src/styles/index.css` (líneas 6 a 12):
```css
:root {
  --color-primary:     #F26671;   /* Coral rosado */
  --color-secondary:   #F2BB4B;   /* Dorado cálido */
  --color-tertiary:    #F2D194;   /* Durazno claro */
  --color-accent:      #F28157;   /* Naranja */
  --color-nature:      #748A63;   /* Verde salvia */
  --color-info:        #547398;   /* Azul acero */
}
```
Cualquier cambio aquí se propagará automáticamente a todas las pantallas de la aplicación.
