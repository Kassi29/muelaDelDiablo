# La Muela del Diablo y otros cuentitos

Web para niños con 5 cuentos bolivianos ilustrados. Para cada cuento hay:
- un lector
- tres minijuegos: ordenar la historia, encontrar diferencias y búsqueda mágica
- un chat con su personaje, que funciona con Google Gemini

**Stack:** React 19, React Router 8, TypeScript y Vite 5. Se publica en Cloudflare Pages y el chat corre en una Pages Function.

## Desarrollo

Necesitas Node.js 22.22 o superior.

```bash
npm install
cp .dev.vars.example .dev.vars   # pon tu GEMINI_API_KEY (sin llave el chat usa respuestas de ejemplo)
npm run dev                      # abre http://localhost:5173
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta Vite (web) y `wrangler pages dev` (API del chat) |
| `npm run build` | Revisa tipos y compila en `dist/` |
| `npm run preview` | Sirve `dist/` igual que en Cloudflare |
| `npm run deploy` | Publica en Cloudflare Pages |
| `npm run optimize:images` | Regenera `public/assets` desde los originales |

## Imágenes

Los originales del diseñador (PNG de hasta 6000 px y SVG con PNG adentro) no están en el repo. Viven en `../muela-assets-src/`.

`scripts/optimize-images.mjs` los convierte a WebP con el tamaño real de uso y nombres limpios. El resultado va a `public/assets/`, que pasa de unos 190 MB a unos 8 MB.

Para agregar o cambiar una imagen:
1. Edita la lista `jobs` del script.
2. Corre `npm run optimize:images`.

## Chat con los personajes

- **La llave nunca llega al navegador.** Solo la lee `functions/api/chat.ts`, que corre en Cloudflare.
- **Límites** (`shared/chat-limits.ts`):
  - 200 caracteres por mensaje.
  - 10 turnos de contexto.
  - Respuestas de 450 caracteres como máximo.
  - Tope diario por IP, si configuras KV.
- **Personalidad y seguridad** (`shared/prompt.ts`): lenguaje para niños de 6 a 10 años y 2-3 oraciones por respuesta. El personaje:
  - no pide ni repite datos personales;
  - desvía los temas no aptos;
  - sugiere hablar con un adulto de confianza si el niño está triste o en peligro;
  - no sale del personaje aunque se lo pidan.
- **Filtros de Gemini:** `BLOCK_LOW_AND_ABOVE` en las cuatro categorías de contenido.

### Poner en producción

1. Guarda la llave como secreto:
   ```bash
   npx wrangler pages secret put GEMINI_API_KEY
   ```
2. (Opcional) Elige el modelo. En el dashboard de Pages, en Settings → Variables, crea `GEMINI_MODEL`. Por defecto se usa `gemini-flash-latest`.
3. (Opcional) Activa el tope diario por IP:
   ```bash
   npx wrangler kv namespace create CHAT_LIMITS
   ```
   Pega el id en `wrangler.toml`. El plan gratis de KV permite 1.000 escrituras al día, o sea unos 1.000 mensajes en total.
4. En Cloudflare, ve a Security → WAF → Rate limiting rules y crea una regla para `/api/chat`: unas 10 solicitudes cada 10 s por IP, y si se pasa, bloquear.
5. En Google AI Studio, define un límite de gasto o cuota para la llave. Es el tope real de costo.

## Códigos QR

Los QR impresos apuntan a `https://muela.pages.dev/actividades/ordenar?story=<id>`. Las rutas están en `src/paths.ts` y **no se pueden cambiar**. Para generar QR nuevos usa `qrGenerator/`.
