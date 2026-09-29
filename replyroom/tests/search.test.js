import test from 'node:test';
import assert from 'node:assert/strict';
import { keywordSearch, fuse, verifiedEvidence } from '../lib/search.js';

test('BM25 prefers a matching passage and excludes unrelated passages', () => {
  const chunks = [
    { id: 'a', text: 'Respect boundaries and allow space after an argument.' },
    { id: 'b', text: 'The weather forecast predicts rain.' },
  ];
  assert.deepEqual(
    keywordSearch('respect boundaries space', chunks).map((c) => c.id),
    ['a'],
  );
  assert.deepEqual(keywordSearch('internship', chunks), []);
});
test('fusion boosts documents present in both searches without duplicates', () => {
  const result = fuse([
    [{ id: 'a' }, { id: 'b' }],
    [{ id: 'b' }, { id: 'c' }],
  ]);
  assert.equal(result[0].id, 'b');
  assert.equal(new Set(result.map((r) => r.id)).size, 3);
});
test('compression rejects invented excerpts, unknown IDs and repeated citations', () => {
  const chunk = {
    id: 'a',
    text: 'Respect boundaries and allow space after an argument.',
  };

  const result = verifiedEvidence(
    [
      { id: 'missing', excerpt: chunk.text },
      { id: 'a', excerpt: 'Invented advice that was never in the book.' },
      { id: 'a', excerpt: 'Respect boundaries and allow space' },
      { id: 'a', excerpt: chunk.text },
    ],
    [chunk],
  );
  assert.equal(result.length, 1);
  assert.equal(result[0].excerpt, 'Respect boundaries and allow space');
});
