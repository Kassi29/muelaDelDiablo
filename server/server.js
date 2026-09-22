import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

import { muelaCharacter } from './characters/muela.js';
import { ninaCharacter } from './characters/nina.js';
import { conejitoCharacter } from './characters/conejito.js';
import { quirquinchosCharacter } from './characters/quirquinchos.js';
import { tortugasCharacter } from './characters/tortugas.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Mapa de personajes
const characterMap = {
  'la-muela': muelaCharacter,
  'la-nina': ninaCharacter,
  'conejito-lloron': conejitoCharacter,
  'quirquinchos': quirquinchosCharacter,
  'tortugas': tortugasCharacter,
};

// Inicializar la API de Gemini
let genAI = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== 'tu_gemini_api_key_aqui') {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log("✅ API de Gemini configurada correctamente.");
  } catch (err) {
    console.error("❌ Error al inicializar Gemini:", err);
  }
} else {
  console.warn("⚠️ GEMINI_API_KEY no encontrada o no configurada en las variables de entorno. Se usará el modo simulado offline.");
}

// Respuestas de fallback offline por personaje
const simulatedResponses = {
  'conejito-lloron': [
    "¡Hola, amigo! *mueve las orejitas* Mis lágrimas de amor hicieron crecer zanahorias gigantes y asustaron a la liebre. 🐰",
    "¡Llorar no es de cobardes! Aprendí que desahogarse está bien y nos ayuda a todos. 🥕",
    "¡Mi mamá cocina hongos deliciosos en el bosque y a mi papá le encanta el té de zanahoria!"
  ],
  'la-muela': [
    "¡Grrr! Yo le arranqué la muela al diablo con todas mis fuerzas para salvar a mis amigos dinosaurios. 🦖",
    "¡Los diablos huían aullando de dolor y nunca más volvieron al Valle de la Luna!",
    "¡Dejamos la muela gigante bien clavada en la tierra como recuerdo de nuestra valentía!"
  ],
  'la-nina': [
    "Aprendí que la verdadera belleza está en el corazón y en ser humilde y amable con los demás. 👑",
    "Cuando me vi en los espejos lloré arrepentida por mi vanidad y bajé a la colina a ayudar a mi pueblo.",
    "Ahora me dedico a compartir y cuidar a quienes más lo necesitan."
  ],
  'quirquinchos': [
    "¡Unidos en familia somos muy astutos! Engañamos al cazador saliendo por turnos en el arenal. 🦔",
    "El cazador se desmayó de tanto correr, pero lo ayudamos a recuperarse y su hijo prometió no dañarnos.",
    "Nuestra espalda pertenece a la naturaleza, ¡no a los charangos!"
  ],
  'tortugas': [
    "Queríamos alcanzar los dorados rayos de la luna subiendo la linda fuente de agua. 🐢",
    "Aunque resbalamos y quedamos petrificadas, alegraremos la plaza para siempre con nuestra historia.",
    "¡Siempre vale la pena soñar y ser solidarios con los hermanos!"
  ]
};

app.post('/api/chat', async (req, res) => {
  const { message, characterId, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'El mensaje es requerido.' });
  }

  const selectedId = characterId && characterMap[characterId] ? characterId : 'conejito-lloron';
  const character = characterMap[selectedId];

  // Si no hay API key de Gemini o falló la inicialización, usar respuestas simuladas
  if (!genAI) {
    console.log(`🤖 [Modo Simulado - ${character.name}] Mensaje recibido:`, message);
    const fallbacks = simulatedResponses[selectedId] || simulatedResponses['conejito-lloron'];
    const randomIndex = Math.floor(Math.random() * fallbacks.length);
    await new Promise(resolve => setTimeout(resolve, 800));
    return res.json({ response: fallbacks[randomIndex] });
  }

  try {
    console.log(`🤖 [Gemini API - ${character.name}] Mensaje recibido:`, message);
    
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.6-flash',
      systemInstruction: character.systemInstruction
    });

    const conversationContents = [
      ...(Array.isArray(history) ? history : []),
      { role: 'user', parts: [{ text: message }] }
    ];

    const result = await model.generateContent({
      contents: conversationContents,
      generationConfig: {
        maxOutputTokens: 600,
        temperature: 0.7,
      }
    });

    let reply = result.response.text().trim();

    // Si la respuesta no termina en puntuación o emoji, recortar hasta la última oración completa
    if (!/[.!?✨🦖🐰🦔🐢👑🍄🥕🦷\u{1F300}-\u{1F9FF}]$/u.test(reply)) {
      const lastPunctuation = Math.max(
        reply.lastIndexOf('.'),
        reply.lastIndexOf('!'),
        reply.lastIndexOf('?')
      );
      if (lastPunctuation > 15) {
        reply = reply.substring(0, lastPunctuation + 1).trim();
      }
    }

    res.json({ response: reply });
  } catch (error) {
    console.error("Error al comunicarse con la API de Gemini:", error.message || error);
    
    // Si la API supera la cuota gratuita (15-20 solicitudes por minuto), avisar amablemente
    if (error?.status === 429 || (error?.message && (error.message.includes('429') || error.message.includes('Quota')))) {
      return res.json({ 
        response: "¡Uy! Hablé tan rápido que me dio un pequeño dolor de cabeza. 😴 Espera unos 20 segunditos y me vuelves a preguntar." 
      });
    }

    res.json({ 
      response: "¡Oh! Parece que me distraje un segundo con algo del bosque. ¿Me lo vuelves a preguntar? 🌸" 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor de chat corriendo en http://localhost:${PORT}`);
});

