import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const PYTHON_PORT = process.env.PYTHON_PORT || 8000;

app.use(express.json());

// Spawn Python FastAPI Server in background
const venvPython = path.resolve(__dirname, 'venv/bin/python');
const pythonCmd = fs.existsSync(venvPython) ? venvPython : 'python3';

console.log(`Starting Python FastAPI ODE Engine using ${pythonCmd}...`);
const pyBackend = spawn(
  pythonCmd,
  ['-m', 'uvicorn', 'backend.main:app', '--port', String(PYTHON_PORT), '--host', '127.0.0.1'],
  {
    cwd: __dirname,
    stdio: 'inherit',
    env: { ...process.env, PYTHONPATH: __dirname },
  }
);

pyBackend.on('error', (err) => {
  console.error('Failed to start Python backend subprocess:', err);
});

// Proxy /api/* requests to Python FastAPI Backend
app.use('/api', async (req, res) => {
  const targetUrl = `http://127.0.0.1:${PYTHON_PORT}/api${req.url}`;
  try {
    const fetchOptions: RequestInit = {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
    };

    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const pyRes = await fetch(targetUrl, fetchOptions);
    const data = await pyRes.json();
    res.status(pyRes.status).json(data);
  } catch (err: any) {
    console.error(`Error proxying to Python backend (${targetUrl}):`, err.message);
    res.status(503).json({
      error: 'Python FastAPI backend initializing or unavailable. Please retry in a moment.',
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
    console.log(`FreshFlow PNG App running on http://localhost:${PORT}`);
  });
}

startServer();
