<!-- CODEGRAPH_START -->
## CodeGraph

In repositories indexed by CodeGraph (a `.codegraph/` directory exists at the repo root), reach for it BEFORE grep/find or reading files when you need to understand or locate code:

- **MCP tool** (when available): `codegraph_explore` answers most code questions in one call — the relevant symbols' verbatim source plus the call paths between them, including dynamic-dispatch hops grep can't follow. Name a file or symbol in the query to read its current line-numbered source. If it's listed but deferred, load it by name via tool search.
- **Shell** (always works): `codegraph explore "<symbol names or question>"` prints the same output.

If there is no `.codegraph/` directory, skip CodeGraph entirely — indexing is the user's decision.
<!-- CODEGRAPH_END -->

## La app

"La Muela del Diablo y otros cuentitos": web para niños de 6 a 10 años con 5 cuentos bolivianos ilustrados (`la-muela`, `la-nina`, `conejito-lloron`, `quirquinchos`, `tortugas`). Por cada cuento hay un lector, 3 minijuegos (ordenar → diferencias → búsqueda) y un chat con su personaje. Todo el texto de la interfaz está en español.

**Stack:** React 19 + React Router 8 (modo data, SPA) + TypeScript, con Vite 5. Se despliega en Cloudflare Pages (proyecto `muela`, `muela.pages.dev`), con una Pages Function para el chat.

- `src/`: la app. `router.tsx` define las rutas, `paths.ts` sus URLs, `routes/` las pantallas, `components/ActivityLayout.tsx` el marco de los juegos, `features/chat/useChat.ts` el estado del chat y `data/stories.ts` los datos de juegos y las rutas de imágenes.
- `functions/api/chat.ts`: `POST /api/chat`, el proxy a Gemini. `GEMINI_API_KEY` solo existe aquí, como secreto. No la nombres nunca `VITE_*`, porque terminaría dentro del bundle público.
- `shared/`: código que usan el navegador y la Function. `characters.ts` define los personajes, `chat-limits.ts` los límites, `prompt.ts` las instrucciones del modelo (solo servidor) e `histories/` el texto de cada cuento (solo servidor).
- `public/assets/`: **generado** por `npm run optimize:images` a partir de los originales en `../muela-assets-src` (fuera del repo). No se editan a mano; si cambia un original, se ajusta `scripts/optimize-images.mjs` y se vuelve a correr.

## Reglas

- **No cambiar las URLs de `src/paths.ts`.** Están impresas en códigos QR (`/actividades/ordenar?story=<id>`).
- Chat infantil: los mensajes se renderizan como texto, nunca como HTML. Los límites se cambian en `shared/chat-limits.ts` y el tono y la seguridad en `shared/prompt.ts`. El servidor valida todo, aunque el cliente también lo haga.
- Las posiciones en % del CSS (mapa, cartas, chat) están calibradas sobre las ilustraciones: solo se tocan si cambia el dibujo.
- Colores y fuentes: usa los tokens de `src/styles/tokens.css`.

## Comandos

- `npm run dev`: Vite en `:5173` y la Function en `:8788`. Para usar Gemini de verdad, copia `.dev.vars.example` como `.dev.vars` y pon ahí la llave.
- `npm run build`: revisa tipos (app y Function) y compila.
- `npm run preview`: igual que en producción (`wrangler pages dev dist`).
- `npm run deploy`: despliega en Cloudflare Pages.
