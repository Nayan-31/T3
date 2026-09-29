import test from 'node:test';
import assert from 'node:assert/strict';
import { answerQuestion } from '../lib/rag.js';

const source = {
  id: 'one:1:0',
  documentId: 'one',
  name: 'Communication.pdf',
  page: 4,
  text: 'When someone asks for space, respect the request and avoid repeated messages.',
};

function services(options = {}) {
  const calls = [],
    requests = [];

  return {
    calls,
    requests,
    readLibrary: async () => ({
      documents: [{ id: 'one' }, { id: 'two' }],
      chunks: [
        source,
        {
          id: 'two:1:0',
          documentId: 'two',
          text: 'Space and boundaries from another book.',
        },
      ],
    }),
    embed: async () => [[1, 2, 3]],
    vectorIndex: () => ({
      query: async (request) => {
        requests.push(request);

        return {
          matches: [{ id: source.id }, { id: 'two:1:0' }, { id: 'unfinished:1:0' }],
        };
      },
    }),
    chat: async (messages) => {
      calls.push(messages);
      if (calls.length === 1) return { query: 'Respecting a request for space' };
      if (calls.length === 2)
        return {
          selections: options.empty ? [] : [{ id: source.id, excerpt: source.text }],
        };

      return options.empty
        ? 'PDFs mein relevant jawab nahi mila.'
        : 'Uski space respect karo. [1] [99]';
    },
  };
}
test('Hinglish survives English query rewriting; filter and verified page sources reach generation', async () => {
  const mock = services();

  const question = 'Usne space maangi hai, kya bolu?';

  const result = await answerQuestion(question, [], 'one', mock);
  assert.equal(mock.requests[0].filter.documentId.$eq, 'one');

  const rerankInput = JSON.parse(mock.calls[1][1].content);
  assert.deepEqual(
    rerankInput.candidates.map((c) => c.id),
    [source.id],
  );

  const finalInput = JSON.parse(mock.calls[2].at(-1).content);
  assert.equal(finalInput.latestMessage, question);
  assert.equal(finalInput.referenceExcerpts[0].page, 4);
  assert.match(mock.calls[2][0].content, /Roman Hinglish/);
  assert.equal(result.sources[0].excerpt, source.text);
  assert.ok(!result.answer.includes('[99]'));
});
test('irrelevant evidence yields a transparent ungrounded result', async () => {
  const mock = services({ empty: true });

  const result = await answerQuestion('Question', [], 'one', mock);
  assert.equal(result.grounded, false);
  assert.deepEqual(result.sources, []);
  assert.deepEqual(JSON.parse(mock.calls[2].at(-1).content).referenceExcerpts, []);
});
test('unknown document fails before provider requests', async () => {
  const mock = services();
  await assert.rejects(answerQuestion('Question', [], 'unknown', mock), /not found/);
  assert.equal(mock.calls.length, 0);
});
