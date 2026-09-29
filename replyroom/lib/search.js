// Pure search helpers: BM25 keyword retrieval + reciprocal rank fusion.
const stop = new Set(
  'a an the is are was were to of and or in on for with it this that i you me my'.split(
    ' ',
  ),
);

export function tokens(text) {
  return (text.toLowerCase().match(/[\p{L}\p{N}]+/gu) || []).filter(
    (t) => t.length > 1 && !stop.has(t),
  );
}

export function keywordSearch(query, chunks, limit = 12) {
  if (!chunks.length) return [];

  const terms = [...new Set(tokens(query))];

  const rows = chunks.map((chunk) => {
    const words = tokens(chunk.text),
      freq = new Map();
    for (const word of words) freq.set(word, (freq.get(word) || 0) + 1);

    return { chunk, length: words.length, freq };
  });

  const avg = rows.reduce((n, r) => n + r.length, 0) / rows.length || 1;

  const df = new Map(
    terms.map((term) => [term, rows.filter((r) => r.freq.has(term)).length]),
  );

  return rows
    .map(({ chunk, length, freq }) => {
      const score = terms.reduce((n, term) => {
        const tf = freq.get(term) || 0;

        const idf = Math.log(
          1 + (rows.length - df.get(term) + 0.5) / (df.get(term) + 0.5),
        );

        return n + (idf * tf * 2.2) / (tf + 1.2 * (0.25 + (0.75 * length) / avg));
      }, 0);

      return { ...chunk, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function fuse(lists, limit = 12) {
  const rows = new Map();
  for (const list of lists)
    list.forEach((item, i) => {
      const previous = rows.get(item.id);
      rows.set(item.id, {
        ...item,
        fusionScore: (previous?.fusionScore || 0) + 1 / (60 + i + 1),
      });
    });

  return [...rows.values()].sort((a, b) => b.fusionScore - a.fusionScore).slice(0, limit);
}

// Keep only model-selected excerpts that occur verbatim in the actual source.
export function verifiedEvidence(selections, candidates) {
  const used = new Set();

  return (Array.isArray(selections) ? selections : [])
    .flatMap((s) => {
      const chunk = candidates.find((c) => c.id === s.id);
      if (
        !chunk ||
        used.has(s.id) ||
        typeof s.excerpt !== 'string' ||
        s.excerpt.trim().length < 20 ||
        !chunk.text.includes(s.excerpt)
      )
        return [];
      used.add(s.id);

      return [{ ...chunk, excerpt: s.excerpt }];
    })
    .slice(0, 5);
}
