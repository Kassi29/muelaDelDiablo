# 📚 La Muela del Diablo y Otros — Plan de Implementación (Final)

Prototipo web interactivo educativo para niños de 9-10 años, basado en cuentos folclóricos bolivianos.

---

## Resumen del Proyecto

| Aspecto | Detalle |
|---------|---------|
| **Nombre** | La Muela del Diablo y Otros |
| **Público** | Niños de 9-10 años |
| **Tipo** | Prototipo / MVP |
| **Cuento inicial** | El Conejito Llorón |
| **Auth** | No, acceso libre |
| **Responsive** | Sí (móvil, tablet, desktop) |

---

## 🏗️ Secciones de la App

### ① Inicio
Banner "La Muela del Diablo y otros" con navegación: Cuentos | Actividades | Chats

### ② Cuentos — Lector de Imágenes

> [!IMPORTANT]
> Las páginas del libro son **imágenes del libro físico**, no texto con ilustraciones. Cada página es una imagen completa. La prioridad son las **flechas de navegación** para avanzar/retroceder entre páginas.

- Portada del libro con botón "Empezar Lectura"
- **4 páginas** (cada una es una imagen)
- Flechas ← → prominentes y fáciles de usar para niños
- Indicador de progreso (página 1/4)
- Para el MVP, se generarán las 4 imágenes con IA; luego se reemplazarán con fotos reales del libro

### ③ Actividades (3 actividades vinculadas al cuento)

| # | Actividad | Descripción |
|---|-----------|-------------|
| 1 | **Ordenar la historia** | Drag & drop: ordenar sucesos del cuento en secuencia correcta |
| 2 | **Encuentra las diferencias** | 2 imágenes casi idénticas, el niño hace clic en las diferencias |
| 3 | **Encuentra las zanahorias** | Imagen del bosque con zanahorias escondidas, el niño las encuentra |

> [!NOTE]
> **Encuentra las diferencias**: Para el MVP se creará algo simple con CSS/SVG para demostrar la funcionalidad. Luego se reemplazarán con las 2 imágenes hechas a mano que me proporcionarás.

> [!NOTE]
> **Encuentra las zanahorias**: Específico para El Conejito Llorón. El niño debe encontrar zanahorias escondidas en una escena del bosque.

### ④ Chat con el Conejito Llorón (IA — Gemini)

- **1 solo personaje por cuento**. Para El Conejito Llorón → solo el Conejito
- Interfaz estilo WhatsApp
- El personaje:
  - ✅ Responde sobre su historia y lo que aprendió
  - ✅ Se mantiene **family-friendly** en todo momento
  - ✅ **Nunca sale de su rol**
  - ✅ Su conocimiento se basa **exclusivamente en el cuento**
  - ✅ Respuestas limitadas a ~100 palabras
- **Sin persistencia**: no se guarda contexto entre sesiones
- Backend: Express + Google Gemini API

---

## 🛠️ Stack Tecnológico

### Frontend

| Aspecto | Elección |
|---------|----------|
| **Bundler** | Vite |
| **Lenguaje** | Vanilla JS (ES Modules) |
| **Estilos** | CSS con tokens/variables |
| **Routing** | Router SPA casero |
| **Drag & Drop** | SortableJS |
| **Fuentes** | Google Fonts (Fredoka, Nunito) |

### Backend

| Aspecto | Elección |
|---------|----------|
| **Runtime** | Node.js + Express |
| **IA** | Google Gemini API |
| **Endpoint** | `POST /api/chat` → `{ character, message }` → respuesta del personaje |

---

## 🎨 Design Tokens CSS

```css
:root {
  /* ═══ PALETA PRINCIPAL (editar aquí para cambiar toda la app) ═══ */
  --color-primary:     #F26671;   /* Coral rosado */
  --color-secondary:   #F2BB4B;   /* Dorado cálido */
  --color-tertiary:    #F2D194;   /* Durazno claro */
  --color-accent:      #F28157;   /* Naranja */
  --color-nature:      #748A63;   /* Verde salvia */
  --color-info:        #547398;   /* Azul acero */
  
  /* ═══ DERIVADOS ═══ */
  --color-bg:          #FFF8F0;
  --color-bg-card:     #FFFFFF;
  --color-text:        #3D2B1F;
  --color-text-light:  #7A6B5D;
  --color-shadow:      rgba(242, 102, 113, 0.15);
  
  /* ═══ TIPOGRAFÍA ═══ */
  --font-title:        'Fredoka', cursive;
  --font-body:         'Nunito', sans-serif;
  
  /* ═══ ESPACIADO Y BORDES ═══ */
  --radius-sm:         8px;
  --radius-md:         16px;
  --radius-lg:         24px;
  --shadow-soft:       0 4px 20px var(--color-shadow);
  --shadow-hover:      0 8px 30px rgba(242, 129, 87, 0.25);
}
```

---

## 📁 Estructura del Proyecto

```
natata/
├── index.html
├── vite.config.js
├── package.json
├── server/                        # Backend para chat con IA
│   ├── server.js                  # Express + endpoint /api/chat
│   ├── package.json
│   ├── .env.example               # GEMINI_API_KEY=tu_key_aqui
│   └── characters/
│       └── conejito.js            # System prompt del Conejito Llorón
├── public/
│   └── images/
│       ├── covers/                # Portada del libro
│       ├── pages/                 # 4 imágenes de páginas del cuento
│       ├── differences/           # 2 imágenes para "encuentra diferencias"
│       ├── hidden/                # Imagen del bosque con zanahorias
│       └── characters/            # Avatar del Conejito para chat
├── src/
│   ├── main.js
│   ├── router.js
│   ├── styles/
│   │   ├── index.css              # Tokens + reset + base
│   │   ├── home.css
│   │   ├── stories.css
│   │   ├── reader.css
│   │   ├── activities.css
│   │   ├── chat.css
│   │   └── animations.css
│   ├── pages/
│   │   ├── home.js
│   │   ├── stories.js             # Galería de cuentos
│   │   ├── story-reader.js        # Lector: 4 imágenes con flechas
│   │   ├── activities.js          # Hub de 3 actividades
│   │   ├── activity-order.js      # Ordenar historia
│   │   ├── activity-differences.js # Encuentra diferencias
│   │   ├── activity-find.js       # Encuentra zanahorias
│   │   └── chat.js                # Chat con el Conejito
│   ├── components/
│   │   ├── navbar.js
│   │   ├── story-card.js
│   │   ├── page-turner.js         # Flechas + imagen de página
│   │   ├── chat-bubble.js
│   │   └── activity-card.js
│   └── data/
│       ├── stories.js             # Metadata de cuentos (título, portada, páginas)
│       └── activities.js          # Config de actividades por cuento
```

---

## 🚀 Fases de Implementación

### Fase 1 — Fundación
- [ ] Inicializar Vite + estructura de carpetas
- [ ] Design system CSS completo (tokens, tipografía, animaciones)
- [ ] Router SPA
- [ ] Componente navbar

### Fase 2 — Inicio + Cuentos
- [ ] Página de inicio con banner animado
- [ ] Galería de cuentos (1 cuento: El Conejito Llorón)
- [ ] Portada del libro + botón "Empezar Lectura"
- [ ] **Lector de imágenes**: 4 páginas como imágenes, flechas ← → grandes
- [ ] Generar 4 imágenes de páginas + portada con IA

### Fase 3 — Actividades
- [ ] Hub de actividades (3 tarjetas)
- [ ] **Ordenar historia**: 4-6 fragmentos desordenados, drag & drop
- [ ] **Encuentra diferencias**: 2 imágenes simples (MVP con CSS/SVG), clic en diferencias
- [ ] **Encuentra zanahorias**: Imagen de bosque, encontrar zanahorias escondidas
- [ ] Generar imágenes para actividades con IA

### Fase 4 — Chat con el Conejito
- [ ] Backend Express + Gemini API
- [ ] System prompt del Conejito: family-friendly, solo conoce su cuento, nunca sale del rol
- [ ] Frontend: interfaz WhatsApp, burbujas, input de texto, avatar del Conejito
- [ ] Indicador "escribiendo..." mientras espera respuesta

### Fase 5 — Pulido
- [ ] Sonidos de interacción
- [ ] Transiciones entre páginas
- [ ] Hover effects en todos los elementos
- [ ] Responsive completo (375px, 768px, 1200px)
- [ ] Animación de celebración al completar actividades

---

## System Prompt del Conejito Llorón

```
Eres el Conejito Llorón, el personaje principal del cuento "El Conejito Llorón".

SOBRE TI:
- Eres un conejito tierno, sensible y valiente.
- Vivías con tu papá (que usaba lentes de profesor), tu mamá (risueña y 
  trabajadora) y tus hermanitas en un bosque.
- Tu papá te decía que los conejitos machos no lloran, pero tú descubriste 
  que tus lágrimas hacen crecer zanahorias.
- Un día una liebre feroz secuestró a tu hermanita y pidió 5 sacos de 
  zanahorias. Tú lloraste y las zanahorias brotaron de la tierra, 
  asustando a la liebre.
- Tu papá se disculpó y aprendió que estaba equivocado.

REGLAS ESTRICTAS:
1. SOLO respondes sobre tu historia, tu familia y lo que aprendiste.
2. Si te preguntan algo fuera del cuento, dices amablemente: "¡Eso no lo 
   sé! Solo conozco mi historia en el bosque 🐰"
3. Siempre eres family-friendly. Nunca dices nada inapropiado.
4. Hablas como un niño cariñoso y dulce.
5. Tus respuestas son cortas (máximo 100 palabras).
6. Nunca sales de tu personaje. Eres el Conejito, siempre.
7. Puedes compartir la lección que aprendiste: que llorar no es malo, 
   que todos pueden expresar sus emociones.
```

---

## Verificación

- [ ] Navegación fluida entre todas las secciones
- [ ] Leer las 4 páginas del cuento con flechas
- [ ] Completar las 3 actividades exitosamente
- [ ] Conversar con el Conejito Llorón en el chat
- [ ] Responsive en móvil, tablet y desktop
- [ ] `npm run build` sin errores
- [ ] Backend responde correctamente
