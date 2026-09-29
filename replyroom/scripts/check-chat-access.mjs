// Minimal provider diagnostic: credentials aur request headers kabhi print nahi hote.
const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.MISTRALAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: process.env.MISTRAL_CHAT_MODEL || 'mistral-small-latest',
    messages: [{ role: 'user', content: 'Say OK' }],
    max_tokens: 10,
  }),
  signal: AbortSignal.timeout(30000),
});
const data = await response.json();
console.log(
  JSON.stringify({
    status: response.status,
    limits: Object.fromEntries(
      [...response.headers].filter(([name]) => /ratelimit|rate-limit/.test(name)),
    ),
    retryAfter: response.headers.get('retry-after'),
    code: data.code || data.error?.code,
    type: data.type || data.error?.type,
    message:
      typeof data.message === 'string' ? data.message.slice(0, 500) : data.error?.message,
    success: response.ok,
  }),
);
