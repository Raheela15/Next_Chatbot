import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

/**
 * Sanitizes an API key by stripping wrapping quotes, backticks, and whitespace.
 * Users frequently paste keys from .env files with quotes like "AIzaSy...",
 * which Vercel stores literally, causing Google APIs to reject with API_KEY_INVALID.
 */
function sanitizeApiKey(raw: string | undefined): string {
  if (!raw) return '';
  return raw.trim().replace(/^["'`\s]+|["'`\s]+$/g, '').trim();
}

/**
 * Maps the UI model ID (sent by the frontend) to the real Google API model name.
 *
 *   gemini-3.8-flash      → gemini-2.0-flash       (primary: fast + capable)
 *   gemini-3.1-flash-lite → gemini-2.0-flash-lite   (lightweight)
 */
function resolveModel(uiModelId: string): string[] {
  if (uiModelId === 'gemini-3.1-flash-lite') {
    return ['gemini-2.0-flash-lite', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  }
  // Default: gemini-3.8-flash (and anything else) → gemini-2.0-flash
  return ['gemini-2.0-flash', 'gemini-1.5-flash'];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ── CORS ────────────────────────────────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Please use POST.' });
  }

  // ── API Key ─────────────────────────────────────────────────────────────────
  const rawKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
  const apiKey = sanitizeApiKey(rawKey);

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return res.status(500).json({
      error:
        'Gemini API key is not configured. Please add GEMINI_API_KEY to your Vercel Project Settings > Environment Variables (without quotes), then redeploy.',
    });
  }

  // ── Request Body ────────────────────────────────────────────────────────────
  const {
    messages,
    systemInstruction,
    model = 'gemini-3.8-flash',
    stream = false,
  } = req.body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required and must not be empty.' });
  }

  // ── Google GenAI Client ─────────────────────────────────────────────────────
  const ai = new GoogleGenAI({ apiKey });

  const formattedContents = messages.map((m: { role: string; content: string }) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content || '' }],
  }));

  const systemPrompt =
    systemInstruction ||
    'You are an intelligent, helpful, and friendly AI assistant powered by Google Gemini. Provide clear, accurate, well-formatted answers with markdown and syntax-highlighted code blocks when appropriate.';

  const modelsToTry = resolveModel(model);

  // ── Streaming SSE Mode ──────────────────────────────────────────────────────
  if (stream) {
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    for (const candidate of modelsToTry) {
      try {
        const streamResponse = await ai.models.generateContentStream({
          model: candidate,
          contents: formattedContents,
          config: { systemInstruction: systemPrompt },
        });

        let chunkCount = 0;
        for await (const chunk of streamResponse) {
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
        console.warn(`[stream] ${candidate} failed:`, err.message || err);
      }
    }

    res.write(`data: ${JSON.stringify({ error: 'Unable to stream response from Gemini API.' })}\n\n`);
    res.write('data: [DONE]\n\n');
    return res.end();
  }

  // ── Standard JSON Mode ──────────────────────────────────────────────────────
  let lastError: any = null;
  for (const candidate of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: candidate,
        contents: formattedContents,
        config: { systemInstruction: systemPrompt },
      });

      return res.status(200).json({
        text: response.text || '',
        model: candidate,
        timestamp: Date.now(),
      });
    } catch (err: any) {
      lastError = err;
      console.warn(`[json] ${candidate} failed:`, err.message || err);
    }
  }

  // ── Friendly Error Messages ─────────────────────────────────────────────────
  const rawMsg: string = lastError?.message || '';
  let friendlyMsg = 'Failed to generate response from Gemini API.';

  if (rawMsg.includes('API_KEY_INVALID') || rawMsg.includes('API key not valid')) {
    friendlyMsg =
      'Invalid Gemini API Key. Please check Vercel Project Settings > Environment Variables and ensure GEMINI_API_KEY is pasted without quotes (e.g. AIzaSy... NOT "AIzaSy...").';
  } else if (rawMsg.includes('RESOURCE_EXHAUSTED') || rawMsg.includes('Quota exceeded')) {
    friendlyMsg = 'Gemini API quota exceeded. Please wait a moment or check your Google AI Studio plan.';
  } else if (rawMsg.includes('MODEL_NOT_FOUND') || rawMsg.includes('not found')) {
    friendlyMsg = 'The requested Gemini model is not available. Please check Google AI Studio for supported models.';
  } else if (rawMsg) {
    try {
      friendlyMsg = JSON.parse(rawMsg)?.error?.message || rawMsg;
    } catch {
      friendlyMsg = rawMsg;
    }
  }

  return res.status(500).json({ error: friendlyMsg });
}
