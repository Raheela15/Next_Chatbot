import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middleware
  app.use(express.json({ limit: '10mb' }));

  // CORS middleware for iframe preview and cross-origin security
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  const rawKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
  const apiKey = rawKey.trim().replace(/^["'`\s]+|["'`\s]+$/g, '').trim();
  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
      timestamp: new Date().toISOString(),
    });
  });

  // Available Gemini models
  app.get('/api/models', (req, res) => {
    res.json({
      defaultModel: 'gemini-3.8-flash',
      availableModels: [
        {
          id: 'gemini-3.8-flash',
          name: 'Gemini 3.8 Flash',
          badge: '3.8 Flash',
          description: 'Deep reasoning and complex task processing. Recommended.',
          freeTier: true,
          recommended: true,
        },
        {
          id: 'gemini-3.1-flash-lite',
          name: 'Gemini 3.1 Flash Lite',
          badge: '3.1 Lite',
          description: 'Ultra-fast, lowest latency, highly responsive free tier model.',
          freeTier: true,
        },
      ],
    });
  });

  // Chat endpoint supporting both JSON and streaming modes
  app.post('/api/chat', async (req, res) => {
    const { messages, systemInstruction, model = 'gemini-3.8-flash', stream = false } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required and must not be empty.' });
    }

    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return res.status(500).json({
        error: 'Gemini API key is not configured. Please ensure GEMINI_API_KEY is configured in your environment or Settings > Secrets.',
      });
    }

    // Map conversation history to Google GenAI format
    const formattedContents = messages.map((m: { role: string; content: string }) => {
      const role = m.role === 'assistant' ? 'model' : 'user';
      return {
        role,
        parts: [{ text: m.content || '' }],
      };
    });

    const defaultSystemPrompt =
      systemInstruction ||
      'You are an intelligent, helpful, and friendly AI assistant powered by Google Gemini. Provide clear, accurate, well-formatted answers with markdown and syntax-highlighted code blocks when appropriate.';

    // Map UI model IDs to real Google API model names
    // gemini-3.8-flash      → gemini-2.0-flash       (primary)
    // gemini-3.1-flash-lite → gemini-2.0-flash-lite  (lightweight)
    const modelsToTry = model === 'gemini-3.1-flash-lite'
      ? ['gemini-2.0-flash-lite', 'gemini-2.0-flash', 'gemini-1.5-flash']
      : ['gemini-2.0-flash', 'gemini-1.5-flash'];

    // 1. Streaming SSE Mode (if explicitly requested)
    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');
      res.flushHeaders?.();

      let clientDisconnected = false;
      req.on('close', () => {
        clientDisconnected = true;
      });

      for (const candidate of modelsToTry) {
        if (clientDisconnected) break;
        try {
          const streamResponse = await ai.models.generateContentStream({
            model: candidate,
            contents: formattedContents,
            config: { systemInstruction: defaultSystemPrompt },
          });

          let chunkCount = 0;
          for await (const chunk of streamResponse) {
            if (clientDisconnected) break;
            const text = chunk.text;
            if (text) {
              res.write(`data: ${JSON.stringify({ text })}\n\n`);
              chunkCount++;
            }
          }

          if (chunkCount > 0) {
            res.write('data: [DONE]\n\n');
            return res.end();
          }
        } catch (err: any) {
          console.warn(`Streaming failed on ${candidate}:`, err.message || err);
        }
      }

      if (!clientDisconnected) {
        res.write(`data: ${JSON.stringify({ error: 'Unable to stream response from Gemini API.' })}\n\n`);
        res.write('data: [DONE]\n\n');
        return res.end();
      }
      return;
    }

    // 2. Standard JSON Response Mode (fastest & 100% resilient through all proxies)
    let lastError: any = null;
    for (const candidate of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: candidate,
          contents: formattedContents,
          config: { systemInstruction: defaultSystemPrompt },
        });

        const text = response.text || '';
        return res.json({
          text,
          model: candidate,
          timestamp: Date.now(),
        });
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${candidate} failed in JSON mode:`, err.message || err);
      }
    }

    return res.status(500).json({
      error: lastError?.message || 'Failed to generate response from Gemini API. Please try again.',
    });
  });

  // Vite dev middleware or production static files
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Gemini Chatbot server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
