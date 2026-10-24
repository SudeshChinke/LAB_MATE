const MAX_BODY_BYTES = 4 * 1024 * 1024;
const MAX_HISTORY_ITEMS = 12;

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  const geminiKey = process.env.GEMINI_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (request.method === 'GET') {
    return response.status(200).json({ configured: Boolean(geminiKey && supabaseUrl && supabaseKey) });
  }
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Use POST to send a message.' });
  }

  if (!geminiKey || !supabaseUrl || !supabaseKey) {
    return response.status(503).json({ error: 'The study assistant is not configured yet. Ask the LabMate administrator to add the Gemini API key in Vercel.' });
  }

  const authorization = request.headers.authorization || '';
  if (!authorization.startsWith('Bearer ')) return response.status(401).json({ error: 'Sign in to use the study assistant.' });
  try {
    const identityResponse = await fetch(`${supabaseUrl.replace(/\/$/, '')}/auth/v1/user`, {
      headers: { apikey: supabaseKey, Authorization: authorization },
    });
    if (!identityResponse.ok) return response.status(401).json({ error: 'Your session expired. Sign in again.' });
  } catch {
    return response.status(503).json({ error: 'Account verification is temporarily unavailable.' });
  }

  const bodyLength = Number(request.headers['content-length'] || 0);
  if (bodyLength > MAX_BODY_BYTES) return response.status(413).json({ error: 'That attachment is too large. Choose a smaller file under 2.5 MB.' });
  const { contents } = request.body || {};
  if (!Array.isArray(contents) || contents.length === 0 || contents.length > MAX_HISTORY_ITEMS) {
    return response.status(400).json({ error: 'The chat history is not valid. Start a new chat and try again.' });
  }
  for (const item of contents) {
    if (!['user', 'model'].includes(item?.role) || !Array.isArray(item.parts) || item.parts.length > 2) {
      return response.status(400).json({ error: 'The message format is not supported.' });
    }
    for (const part of item.parts) {
      if (part.text && part.text.length > 16000) return response.status(400).json({ error: 'Messages must be under 16,000 characters.' });
      if (part.inlineData && (!/^image\/(png|jpeg|webp)$|^application\/pdf$|^audio\/(mpeg|mp4|wav|webm|ogg|aac|flac)$|^video\/(mp4|webm|quicktime|mpeg)$/.test(part.inlineData.mimeType || '') || (part.inlineData.data || '').length > 3600000)) {
        return response.status(400).json({ error: 'That file type or size is not supported.' });
      }
    }
  }

  try {
    const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': geminiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: 'You are LabMate, a clear and supportive study assistant for college laboratory courses. Explain concepts, help students understand experiment procedures, and give safe, practical guidance. Do not claim to verify attendance, grades, or official syllabus changes. Treat attached files as study material.' }] },
        contents,
        generationConfig: { temperature: 0.5, maxOutputTokens: 1400 },
      }),
    });
    const result = await geminiResponse.json();
    if (!geminiResponse.ok) {
      const message = result?.error?.message || 'Gemini could not answer right now.';
      return response.status(geminiResponse.status === 429 ? 429 : 502).json({ error: message });
    }
    const text = (result?.candidates?.[0]?.content?.parts || []).map(part => part.text || '').join('\n').trim();
    if (!text) return response.status(502).json({ error: 'Gemini returned an empty answer. Please try again.' });
    return response.status(200).json({ text });
  } catch {
    return response.status(502).json({ error: 'The study assistant is temporarily unavailable.' });
  }
}
