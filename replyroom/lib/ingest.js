import { createHash } from 'node:crypto';
import { PDFParse } from 'pdf-parse';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { readLibrary, commitDocument } from './store.js';
import { AppError, vectorIndex, embed } from './providers.js';

// Same PDF ki in-progress request ko reuse karne ke liye.
const pending = new Map();

// Entry point: stable ID banao aur duplicate running upload check karo.
export function ingest(buffer, name) {
  const id = createHash('sha256').update(buffer).digest('hex');
  if (pending.has(id)) return pending.get(id);

  const job = ingestDocument(buffer, name, id).finally(() => pending.delete(id));
  pending.set(id, job);

  return job;
}

// PDF ingestion: parsing se storage tak ka complete flow.
async function ingestDocument(buffer, name, id) {
  const existing = (await readLibrary()).documents.find((d) => d.id === id);
  if (existing) return { document: existing, duplicate: true };

  const index = vectorIndex();

  const parser = new PDFParse({ data: new Uint8Array(buffer) });

  let parsed;

  try {
    parsed = await parser.getText();
  } catch {
    throw new AppError(
      'Could not read this PDF. It may be damaged or password-protected.',
    );
  } finally {
    await parser.destroy();
  }

  // Har page ka text chhote overlapping chunks mein split hoga.
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1200,
    chunkOverlap: 200,
  });

  const chunks = [];
  for (const page of parsed.pages) {
    const clean = page.text
      .replace(/\u0000/g, '')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    if (!clean) continue;

    const parts = await splitter.splitText(clean);
    for (let i = 0; i < parts.length; i++)
      chunks.push({
        id: `${id}:${page.num}:${i}`,
        documentId: id,
        name,
        page: page.num,
        text: parts[i],
      });
  }
  if (!chunks.length)
    throw new AppError(
      'No readable text found. Upload a text PDF; scanned PDFs need OCR first.',
    );
  if (chunks.length > 12000)
    throw new AppError(
      'This PDF is too large to index in one upload. Split it into smaller PDFs.',
    );

  // Deterministic IDs make a failed upload retry safe, even after partial vector writes.
  for (let offset = 0; offset < chunks.length; offset += 32) {
    const batch = chunks.slice(offset, offset + 32);

    const vectors = await embed(batch.map((c) => c.text));
    await index.upsert({
      records: batch.map((c, i) => ({
        id: c.id,
        values: vectors[i],
        metadata: {
          documentId: c.documentId,
          name: c.name,
          page: c.page,
          text: c.text,
        },
      })),
    });
  }

  // Indexing complete hone par bookshelf ke liye summary banao.
  const document = {
    id,
    name,
    pages: parsed.total,
    chunks: chunks.length,
    addedAt: new Date().toISOString(),
  };

  // Publish locally only when all vector writes succeed; retrieval excludes uncommitted records.
  await commitDocument(document, chunks);

  return { document, duplicate: false };
}
