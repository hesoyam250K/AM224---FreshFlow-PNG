import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API endpoint for AI Scenario Explainer
app.post('/api/gemini/explain', async (req, res) => {
  try {
    const {
      produceType,
      initialQty,
      durationHours,
      storageCondition,
      scenarioName,
      spoilageRate,
      remainingQty,
      lostQty,
      percentageLoss,
      halfLifeHours,
      estimatedLossPGK,
      equilibriumQty,
      incomingSupplyRate,
    } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'Gemini API key is not configured in environment.',
      });
    }

    const prompt = `You are an expert agricultural economist and applied mathematician writing for "FreshFlow PNG", an exploratory first-order differential equations simulation tool for Papua New Guinea supply chains.

    Here are the simulation results calculated by the deterministic ODE solver:
    - Produce Type: ${produceType}
    - Scenario: ${scenarioName}
    - Initial Quantity (Q0): ${initialQty} kg
    - Transport Duration (t): ${durationHours} hours
    - Storage Condition: ${storageCondition}
    - Spoilage Rate (k): ${spoilageRate} hr⁻¹
    - Incoming Supply Rate (S): ${incomingSupplyRate ? incomingSupplyRate + ' kg/hr' : 'N/A'}
    - Equilibrium Quantity (Q* = S/k): ${equilibriumQty ? equilibriumQty.toFixed(1) + ' kg' : 'N/A'}
    - Remaining Usable Produce: ${remainingQty.toFixed(1)} kg (${(100 - percentageLoss).toFixed(1)}%)
    - Estimated Produce Lost: ${lostQty.toFixed(1)} kg (${percentageLoss.toFixed(1)}% loss)
    - Calculated Produce Half-life (t_1/2): ${halfLifeHours ? halfLifeHours.toFixed(1) + ' hours' : 'N/A'}
    - Estimated Financial Loss: ${estimatedLossPGK ? 'K' + estimatedLossPGK.toLocaleString() + ' PGK' : 'N/A'}

    Please provide a concise, high-level narrative (3 paragraphs max) interpreting these mathematical results in the context of Papua New Guinea logistics (e.g., Highlands Highway transport, transit delays, ambient temperature vs cold chain storage).

    STRICT RULES:
    1. Do NOT invent new numbers or change any calculated math values. Use ONLY the figures given above.
    2. Clearly reference that these are "simulated model estimates based on dQ/dt = -kQ".
    3. Highlight practical logistics recommendations (e.g. storage improvement vs route speed optimization).
    4. Keep tone professional, educational, encouraging, and clear.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are an AI Scenario Explainer for FreshFlow PNG. Explain mathematical ODE model outputs in clear, structured, accessible language.',
      },
    });

    const explanationText = response.text || 'No explanation generated.';

    return res.json({
      explanation: explanationText,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Error generating AI scenario explanation:', err);
    return res.status(500).json({
      error: err.message || 'Failed to generate AI scenario explanation.',
    });
  }
});

// Mount Vite middleware in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = await import('fs').then((fs) =>
          fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8')
        );
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`FreshFlow PNG Server running on http://localhost:${PORT}`);
  });
}

startServer();
