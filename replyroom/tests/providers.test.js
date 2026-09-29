import test from 'node:test';
import assert from 'node:assert/strict';
import { chat } from '../lib/providers.js';

test('zero provider capacity stops after one request and explains required account action', async () => {
  const originalFetch = globalThis.fetch;
  const keys = ['MISTRALAI_API_KEY', 'PINECONE_API_KEY', 'PINECONE_INDEX'];
  const previous = keys.map((key) => process.env[key]);
  let requests = 0;

  try {
    for (const key of keys) process.env[key] = 'test-placeholder';
    globalThis.fetch = async () => {
      requests++;
      return new Response(JSON.stringify({ message: 'Rate limit exceeded' }), {
        status: 429,
        headers: { 'x-ratelimit-limit-req-minute': '0' },
      });
    };

    await assert.rejects(chat([{ role: 'user', content: 'Hello' }]), (error) => {
      assert.equal(error.status, 429);
      assert.match(error.message, /0 requests per minute/);
      assert.match(error.message, /Check model access/);
      return true;
    });
    assert.equal(requests, 1);
  } finally {
    globalThis.fetch = originalFetch;
    keys.forEach((key, index) => {
      if (previous[index] === undefined) delete process.env[key];
      else process.env[key] = previous[index];
    });
  }
});
