import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/generative-ai';
import { conejitoCharacter } from './characters/conejito.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Inicializar la API de Gemini
let aiModel = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  try {
    const ai = new GoogleGenAI({ apiKey });
    aiModel = ai.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: conejitoCharacter.systemInstruction
    });
    console.log("✅ API de Gemini configurada correctamente.");
  } catch (err) {
    console.error("❌ Error al inicializar Gemini:", err);
  }
} else {
  console.warn("⚠️ GEMINI_API_KEY no encontrada en las variables de entorno. Se usará el modo simulado offline.");
}

// Respuestas de fallback (modo simulado offline o sin API key)
const simulatedResponses = [
  "¡Hola, amigo! *mueve las orejitas* ¿Sabías que a mi mamá le encanta cocinar hongos del bosque? 🍄 Son riquísimos.",
  "¡Caracoles! Llorar no es de cobardes, a mí mis lágrimas me ayudaron a hacer crecer zanahorias gigantes y salvar a mi hermanita de la liebre feroz. 🐰🥕",
  "¡Qué divertido! Mi papá usa unos lentes de profesor muy grandes, dice que es porque no comió suficientes zanahorias de pequeño. ¡Yo sí como muchas!",
  "El bosque es hermoso y frondoso. Me encanta correr entre las flores con mis hermanitas y jugar a las escondidas.",
  "¡Oh, mis orejitas se confunden con eso! No sé mucho de esas cosas de humanos, pero te puedo contar sobre cómo asustamos a la liebre gigante. 🥕"
];

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'El mensaje es requerido.' });
  }

  // Si no hay API key de Gemini o falló la inicialización, usar respuestas simuladas
  if (!aiModel) {
    console.log("🤖 [Modo Simulado] Mensaje recibido:", message);
    const randomIndex = Math.floor(Math.random() * simulatedResponses.length);
    // Simular retraso
    await new Promise(resolve => setTimeout(resolve, 800));
    return res.json({ response: simulatedResponses[randomIndex] });
  }

  try {
    console.log("🤖 [Gemini API] Mensaje recibido:", message);
    const result = await aiModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: message }] }],
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.7,
      }
    });

    const reply = result.response.text();
    res.json({ response: reply });
  } catch (error) {
    console.error("Error al comunicarse con la API de Gemini:", error);
    res.json({ 
      response: "¡Oh, caracoles! Me dio un pequeño dolor de cabeza al pensar en eso. ¿Me lo puedes volver a preguntar de otra forma? 🐰" 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
