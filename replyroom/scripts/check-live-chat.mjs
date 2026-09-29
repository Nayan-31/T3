import assert from 'node:assert/strict';

// Running app aur configured providers ke saath real Hinglish request verify karo.
// Is script se normal provider usage charges lag sakte hain.
const base = 'http://127.0.0.1:3000';

try {
  const response = await fetch(`${base}/api/documents`);
  const library = await response.json();
  assert.equal(library.configuration.ready, true);
  assert.ok(library.documents.length >= 2, 'Both PDFs must finish indexing first.');
  console.log(
    'Ready books:',
    library.documents.map((d) => `${d.name} (${d.chunks} chunks)`).join(', '),
  );

  const reply = await fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message:
        'Conversation mein saamne wale ko dhyan se sunna aur unki interests samajhna kyun zaroori hai? Main kaise baat karu?',
      history: [],
    }),
    signal: AbortSignal.timeout(180000),
  });
  const result = await reply.json();
  if (!reply.ok) throw new Error(result.error || `HTTP ${reply.status}`);
  assert.ok(result.answer?.length > 0);
  assert.ok(result.sources?.length > 0, 'Expected relevant book passages.');
  console.log('Answer:', result.answer);
  console.log(
    'Citations:',
    result.sources.map((s) => `[${s.number}] ${s.name}, PDF page ${s.page}`).join('; '),
  );
} catch (error) {
  console.error('Live chat check failed:', error.message);
  process.exitCode = 1;
}
