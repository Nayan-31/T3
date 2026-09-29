const model = process.env.GEMINI_CHAT_MODEL || 'gemini-2.5-flash';
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
  {
    method: 'POST',
    headers: {
      'x-goog-api-key': process.env.GEMINI_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: 'Say OK' }] }],
      generationConfig: { maxOutputTokens: 64 },
    }),
    signal: AbortSignal.timeout(30000),
  },
);
const data = await response.json();
console.log(
  JSON.stringify({
    model,
    status: response.status,
    error: data.error?.status,
    message: data.error?.message
      ?.replaceAll(process.env.GEMINI_API_KEY, '[redacted]')
      .slice(0, 1200),
    violations: data.error?.details
      ?.flatMap((d) => d.violations || [])
      .map((v) => ({
        metric: v.quotaMetric,
        id: v.quotaId,
        dimensions: v.quotaDimensions,
        value: v.quotaValue,
      })),
    retry: data.error?.details?.find((d) => d.retryDelay)?.retryDelay,
    finishReason: data.candidates?.[0]?.finishReason,
  }),
);
