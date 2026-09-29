import assert from 'node:assert/strict';
const base = 'http://127.0.0.1:3000';

const page = await fetch(base);
assert.equal(page.status, 200);
assert.match(await page.text(), /Good conversations/);

const library = await (await fetch(base + '/api/documents')).json();
assert.ok(Array.isArray(library.documents));
assert.equal(typeof library.configuration.ready, 'boolean');

const invalid = await fetch(base + '/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: '' }),
});
assert.equal(invalid.status, 400);

const cross = await fetch(base + '/api/chat', {
  method: 'POST',
  headers: { Origin: 'https://example.com', 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Hello' }),
});
assert.equal(cross.status, 403);

const form = new FormData();
form.append('file', new File(['not pdf'], 'fake.pdf', { type: 'application/pdf' }));

const bad = await fetch(base + '/api/documents', { method: 'POST', body: form });
assert.equal(bad.status, 400);
console.log(
  'HTTP smoke checks passed: page, library status, message validation, origin check and invalid PDF.',
);
