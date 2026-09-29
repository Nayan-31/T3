const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
  headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY },
  signal: AbortSignal.timeout(30000),
});
const data = await response.json();
console.log(
  JSON.stringify({
    status: response.status,
    error: data.error?.status,
    reasons: data.error?.details?.map((d) => d.reason).filter(Boolean),
    models: data.models
      ?.filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
      .map((m) => m.name),
  }),
);
if (response.ok) {
  const { chat } = await import('../lib/providers.js');
  try {
    const result = await chat(
      [{ role: 'user', content: 'Return JSON with ok set to true.' }],
      true,
    );
    console.log('Gemini generation:', JSON.stringify(result));
  } catch (error) {
    console.error(
      'Generation check:',
      error.constructor.name === 'AppError' ? error.message : error.name,
    );
    process.exitCode = 1;
  }
}
