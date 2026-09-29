import test from 'node:test';
import assert from 'node:assert/strict';
import { chat, embed, configuration } from '../lib/providers.js';

async function withGemini(run) {
  const keys = [
    'CHAT_PROVIDER',
    'GEMINI_API_KEY',
    'MISTRALAI_API_KEY',
    'PINECONE_API_KEY',
    'PINECONE_INDEX',
  ];
  const previous = keys.map((key) => process.env[key]);
  const originalFetch = globalThis.fetch;
  try {
    keys.forEach((key) => {
      process.env[key] = 'test-placeholder';
    });
    process.env.CHAT_PROVIDER = 'gemini';
    await run();
  } finally {
    globalThis.fetch = originalFetch;
    keys.forEach((key, i) => {
      if (previous[i] === undefined) delete process.env[key];
      else process.env[key] = previous[i];
    });
  }
}

test('Gemini maps system instructions, history and JSON mode correctly', async () => {
  await withGemini(async () => {
    globalThis.fetch = async (url, options) => {
      assert.match(url, /generativelanguage.googleapis.com/);
      assert.ok(!url.includes('test-placeholder'));
      const body = JSON.parse(options.body);
      assert.equal(body.systemInstruction.parts[0].text, 'Use Hinglish');
      assert.deepEqual(
        body.contents.map((m) => m.role),
        ['user', 'model', 'user'],
      );
      assert.equal(body.contents.at(-1).parts[0].text, 'Ab kya bolu?');
      assert.equal(body.generationConfig.responseMimeType, 'application/json');
      return Response.json({
        candidates: [
          {
            finishReason: 'STOP',
            content: {
              parts: [
                { thought: true, text: 'internal' },
                { text: '{"query":"respect boundaries"}' },
              ],
            },
          },
        ],
      });
    };
    assert.deepEqual(
      await chat(
        [
          { role: 'system', content: 'Use Hinglish' },
          { role: 'user', content: 'Space maangi hai' },
          { role: 'assistant', content: 'Samjha' },
          { role: 'user', content: 'Ab kya bolu?' },
        ],
        true,
      ),
      { query: 'respect boundaries' },
    );
  });
});

test('Gemini quota returns actionable error and embeddings still use Mistral', async () => {
  await withGemini(async () => {
    globalThis.fetch = async (url) => {
      if (url.includes('generativelanguage'))
        return Response.json(
          { error: { status: 'RESOURCE_EXHAUSTED' } },
          { status: 429 },
        );
      assert.match(url, /api.mistral.ai\/v1\/embeddings/);
      return Response.json({ data: [{ index: 0, embedding: Array(1024).fill(0) }] });
    };
    await assert.rejects(
      chat([{ role: 'user', content: 'Hi' }]),
      (e) => e.status === 429 && /Gemini quota/.test(e.message),
    );
    assert.equal((await embed(['query']))[0].length, 1024);
    delete process.env.GEMINI_API_KEY;
    assert.ok(configuration().missing.includes('GEMINI_API_KEY'));
  });
});

test('Gemini refuses truncated JSON instead of treating it as an answer', async () => {
  await withGemini(async () => {
    globalThis.fetch = async () =>
      Response.json({
        candidates: [
          { finishReason: 'MAX_TOKENS', content: { parts: [{ text: '{"query":' }] } },
        ],
      });
    await assert.rejects(
      chat([{ role: 'user', content: 'Hi' }], true),
      /could not complete/,
    );
  });
});
