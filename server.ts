import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  runDeteriorationSimulation,
  runSupplySimulation,
  DeteriorationRequest,
  SupplyRequest,
} from './server/odeEngine.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const PYTHON_PORT = Number(process.env.PYTHON_PORT) || 8000;

app.use(express.json());

// Helper to try forwarding to local Python FastAPI backend if running
async function tryProxyToPython(req: express.Request, res: express.Response, pathSuffix: string): Promise<boolean> {
  const targetUrl = `http://127.0.0.1:${PYTHON_PORT}${pathSuffix}`;
  try {
    const fetchOptions: RequestInit = {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }
    const pyRes = await fetch(targetUrl, { ...fetchOptions, signal: AbortSignal.timeout(1000) });
    if (pyRes.ok) {
      const data = await pyRes.json();
      res.status(pyRes.status).json(data);
      return true;
    }
  } catch {
    // Python process not running locally; continue to built-in simulation engine
  }
  return false;
}

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const proxied = await tryProxyToPython(req, res, '/api/health');
  if (proxied) return;

  res.json({
    status: 'ok',
    engine: 'ODE Simulation Engine (FastAPI / Node.js RK4)',
    version: '2.0.0',
  });
});

// Deterioration ODE simulation endpoint: dQ/dt = -k * Q
app.post('/api/simulate/deterioration', async (req, res) => {
  const proxied = await tryProxyToPython(req, res, '/api/simulate/deterioration');
  if (proxied) return;

  try {
    const q0 = req.body.initial_quantity ?? req.body.initialQuantity;
    if (q0 !== undefined && q0 <= 0) {
      return res.status(422).json({
        detail: [{ loc: ['body', 'initial_quantity'], msg: 'initial_quantity must be greater than 0', type: 'value_error' }],
      });
    }

    const result = runDeteriorationSimulation(req.body as DeteriorationRequest);
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ detail: err.message || 'Simulation failed' });
  }
});

// Supply & spoilage ODE simulation endpoint: dQ/dt = S - k * Q
app.post('/api/simulate/supply', async (req, res) => {
  const proxied = await tryProxyToPython(req, res, '/api/simulate/supply');
  if (proxied) return;

  try {
    const q0 = req.body.initial_quantity ?? req.body.initialQuantity;
    if (q0 !== undefined && q0 < 0) {
      return res.status(422).json({
        detail: [{ loc: ['body', 'initial_quantity'], msg: 'initial_quantity must be non-negative', type: 'value_error' }],
      });
    }

    const s = req.body.supply_rate ?? req.body.supplyRate;
    if (s !== undefined && s < 0) {
      return res.status(422).json({
        detail: [{ loc: ['body', 'supply_rate'], msg: 'supply_rate must be non-negative', type: 'value_error' }],
      });
    }

    const result = runSupplySimulation(req.body as SupplyRequest);
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ detail: err.message || 'Simulation failed' });
  }
});

// Gemini AI Explanation Endpoint
app.post('/api/gemini/explain', async (req, res) => {
  const proxied = await tryProxyToPython(req, res, '/api/gemini/explain');
  if (proxied) return;

  const b = req.body || {};
  const produceType = b.produce_type || b.produceType || 'tomatoes';
  const scenarioId = b.scenario_id || b.scenarioName || 'normal_journey';
  const initialQty = b.initial_quantity ?? b.initialQty ?? 1000;
  const durationHours = b.duration_hours ?? b.durationHours ?? 12;
  const storageCondition = b.storage_condition || b.storageCondition || 'normal';
  const spoilageRate = Number(b.spoilage_rate ?? b.spoilageRate ?? 0.018);
  const remainingQty = Number(b.remaining_quantity ?? b.remainingQty ?? 800);
  const quantityLost = Number(b.quantity_lost ?? b.lostQty ?? 200);
  const percentageLoss = Number(b.percentage_loss ?? b.percentageLoss ?? 20);
  const halfLifeHours = b.half_life_hours ?? b.halfLifeHours ?? (spoilageRate > 0 ? (Math.LN2 / spoilageRate).toFixed(1) : 'N/A');
  const equilibriumQty = b.equilibrium_quantity ?? b.equilibriumQty ?? null;
  const incomingSupplyRate = b.incoming_supply_rate ?? b.incomingSupplyRate ?? null;

  const apiKey = process.env.GEMINI_API_KEY;

  const prompt = `You are an agricultural economist and applied mathematician writing for "FreshFlow PNG", an educational ODE simulation tool.

Here are the exact simulation outputs calculated by the ODE backend:
- Produce Type: ${produceType}
- Journey Scenario: ${scenarioId}
- Initial Quantity (Q0): ${initialQty} kg
- Transport Duration (t): ${durationHours} hours
- Storage Condition: ${storageCondition}
- Deterioration Rate (k): ${spoilageRate.toFixed(4)} hr^-1
- Remaining Usable Produce: ${remainingQty.toFixed(1)} kg (${(100 - percentageLoss).toFixed(1)}%)
- Estimated Produce Lost: ${quantityLost.toFixed(1)} kg (${percentageLoss.toFixed(1)}% loss)
- Crop Half-Life (t1/2): ${halfLifeHours} hours
- Equilibrium Quantity (Q*): ${equilibriumQty !== null ? `${equilibriumQty} kg` : 'N/A'}
- Incoming Supply Rate (S): ${incomingSupplyRate !== null ? `${incomingSupplyRate} kg/hr` : 'N/A'}

Please provide a short, plain-English summary (2 to 3 paragraphs max) interpreting these mathematical results.

STRICT RULES:
1. Do NOT invent new numbers or change any calculated values. Use ONLY the figures provided above.
2. Reference that these results are simulated model estimates based on differential equations.
3. Keep the tone clear, encouraging, educational, and professional.`;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
      const aiResponse = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      const explanationText = aiResponse.text || 'No explanation generated.';
      return res.json({
        explanation: explanationText,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('Gemini API call error:', err);
    }
  }

  // Fallback summary when GEMINI_API_KEY is not configured
  const fallbackExplanation =
    `According to the first-order differential equation model dQ/dt = -kQ, your initial batch of ${initialQty} kg of ${produceType} ` +
    `experiences an effective deterioration rate of ${spoilageRate.toFixed(4)} hr⁻¹ under ${storageCondition} storage conditions.\n\n` +
    `Over the ${durationHours}-hour transit through the ${scenarioId.replace(/_/g, ' ')} corridor, approximately ` +
    `${remainingQty.toFixed(1)} kg (${(100 - percentageLoss).toFixed(1)}%) of produce remains marketable, with an estimated loss of ` +
    `${quantityLost.toFixed(1)} kg (${percentageLoss.toFixed(1)}%). The calculated biological half-life is ${halfLifeHours} hours.\n\n` +
    `To minimize post-harvest loss in this PNG transit corridor, upgrading storage containers or optimizing departure schedules ` +
    `will substantially lower the spoilage rate k and preserve supply chain revenue.`;

  return res.json({
    explanation: fallbackExplanation,
    timestamp: new Date().toISOString(),
  });
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
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FreshFlow PNG App running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
