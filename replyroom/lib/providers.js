import { Pinecone } from '@pinecone-database/pinecone';

export class AppError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

export function configuration() {
  const provider = process.env.CHAT_PROVIDER || 'mistral';
  const required = ['MISTRALAI_API_KEY', 'PINECONE_API_KEY', 'PINECONE_INDEX'];
  if (provider === 'gemini') required.push('GEMINI_API_KEY');
  if (provider === 'openai') required.push('OPENAI_API_KEY');
  const missing = required.filter((key) => !process.env[key]);

  return { ready: missing.length === 0, missing, provider };
}

function requireConfiguration() {
  const { missing } = configuration();
  if (missing.length)
    throw new AppError(
      `Add ${missing.join(', ')} to .env.local and restart the app.`,
      503,
    );
}

export function vectorIndex() {
  requireConfiguration();

  return new Pinecone({ apiKey: process.env.PINECONE_API_KEY }).index({
    name: process.env.PINECONE_INDEX,
    namespace: process.env.PINECONE_NAMESPACE || 'replyroom-v1',
  });
}

async function mistral(endpoint, body) {
  requireConfiguration();
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await fetch(`https://api.mistral.ai/v1/${endpoint}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.MISTRALAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(90000),
    });
    if (response.ok) return response.json();

    // Zero allowed requests ka matlab cooldown se solve hone wala burst nahi hai.
    if (
      response.status === 429 &&
      response.headers.get('x-ratelimit-limit-req-minute') === '0'
    ) {
      throw new AppError(
        'Mistral currently allows 0 requests per minute for this model. Check model access and API limits in your Mistral Admin account. Retrying will not help while this limit is zero. Your books are saved.',
        429,
      );
    }

    if ((response.status === 429 || response.status >= 500) && attempt < 2) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** attempt));
      continue;
    }
    if (response.status === 429) {
      throw new AppError(
        'Mistral is rate-limiting requests. Your books are saved. Wait and retry; if this continues, check your Mistral account usage limits.',
        429,
      );
    }
    throw new AppError(
      `Mistral request failed (${response.status}). Check your API key, quota and model access.`,
      502,
    );
  }
}

export async function embed(input) {
  const data = await mistral('embeddings', { model: 'mistral-embed', input });

  const vectors = data.data.sort((a, b) => a.index - b.index).map((row) => row.embedding);
  if (
    vectors.length !== input.length ||
    vectors.some((v) => !Array.isArray(v) || v.length !== 1024)
  )
    throw new AppError('Unexpected embedding response.', 502);

  return vectors;
}

export async function chat(messages, json = false) {
  if (process.env.CHAT_PROVIDER === 'gemini') return geminiChat(messages, json);
  if (process.env.CHAT_PROVIDER === 'openai') return openaiChat(messages, json);

  const data = await mistral('chat/completions', {
    model: process.env.MISTRAL_CHAT_MODEL || 'mistral-small-latest',
    messages,
    temperature: 0.2,
    max_tokens: 2200,
    ...(json ? { response_format: { type: 'json_object' } } : {}),
  });

  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== 'string')
    throw new AppError('The model returned an unexpected response. Please retry.', 502);
  if (!json) return content;

  try {
    return JSON.parse(content);
  } catch {
    throw new AppError('The model returned invalid JSON. Please retry.', 502);
  }
}

// Chat provider badalta hai; document/query embeddings Mistral ke hi rehte hain.
async function geminiChat(messages, json) {
  requireConfiguration();
  const model = process.env.GEMINI_CHAT_MODEL || 'gemini-2.5-flash';
  const system = messages
    .filter((m) => m.role === 'system')
    .map((m) => m.content)
    .join('\n\n');
  const contents = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: 'POST',
      headers: {
        'x-goog-api-key': process.env.GEMINI_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 8192,
          ...(json ? { responseMimeType: 'application/json' } : {}),
        },
      }),
      signal: AbortSignal.timeout(90000),
    },
  );
  const data = await response.json();
  if (!response.ok) {
    const invalidKey = data.error?.details?.some(
      (detail) => detail.reason === 'API_KEY_INVALID',
    );
    if (invalidKey || response.status === 401 || response.status === 403) {
      throw new AppError(
        'Gemini rejected the API key or its permissions. Add a valid Gemini API key from Google AI Studio to GEMINI_API_KEY in .env.local, then restart.',
        503,
      );
    }
    if (response.status === 429)
      throw new AppError(
        'Gemini quota or rate limit reached. Check your Google AI Studio usage limits and retry later. Your books are saved.',
        429,
      );
    throw new AppError(
      `Gemini request failed (${response.status}). Check your configured model and Google AI Studio access.`,
      502,
    );
  }

  const candidate = data.candidates?.[0];
  if (candidate?.finishReason !== 'STOP')
    throw new AppError(
      'Gemini could not complete the response. Please retry or rephrase the question.',
      502,
    );
  const text = candidate.content?.parts
    ?.filter((part) => !part.thought && typeof part.text === 'string')
    .map((part) => part.text)
    .join('');
  if (!text)
    throw new AppError(
      'Gemini returned no answer. Please retry or rephrase the question.',
      502,
    );
  if (!json) return text;
  try {
    return JSON.parse(text);
  } catch {
    throw new AppError('Gemini returned invalid JSON. Please retry.', 502);
  }
}

async function openaiChat(messages, json) {
  requireConfiguration();
  const model = process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini';

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.2,
      max_tokens: 4096,
      ...(json ? { response_format: { type: 'json_object' } } : {}),
    }),
    signal: AbortSignal.timeout(90000),
  });
  
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new AppError(
        'OpenAI rejected the API key or its permissions. Add a valid OpenAI API key to OPENAI_API_KEY in .env.local, then restart.',
        503,
      );
    }
    if (response.status === 429) {
      throw new AppError(
        'OpenAI quota or rate limit reached. Check your usage limits and retry later. Your books are saved.',
        429,
      );
    }
    throw new AppError(
      `OpenAI request failed (${response.status}). Check your configured model and access.`,
      502,
    );
  }

  const choice = data.choices?.[0];
  if (choice?.finish_reason !== 'stop') {
    throw new AppError(
      'OpenAI could not complete the response. Please retry or rephrase the question.',
      502,
    );
  }
  
  const content = choice.message?.content;
  if (!content) {
    throw new AppError(
      'OpenAI returned no answer. Please retry or rephrase the question.',
      502,
    );
  }
  
  if (!json) return content;
  
  try {
    return JSON.parse(content);
  } catch {
    throw new AppError('OpenAI returned invalid JSON. Please retry.', 502);
  }
}
