import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { Pinecone } from '@pinecone-database/pinecone';
import { ingest } from '../lib/ingest.js';
import { embed, AppError } from '../lib/providers.js';

// Project folder ke PDFs ko directly index karo; browser upload ki zaroorat nahi.
try {
  const filenames = process.argv.slice(2);
  const files = filenames.length
    ? filenames
    : (await readdir(process.cwd())).filter((name) =>
        name.toLowerCase().endsWith('.pdf'),
      );

  if (!files.length) throw new AppError('No PDFs found. Pass PDF paths as arguments.');

  // Books embed karne se pehle dono providers aur index dimensions check karo.
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  const index = await pc.indexes.describe(process.env.PINECONE_INDEX);
  if (index.dimension !== 1024)
    throw new AppError('Pinecone index must have 1024 dimensions.');
  await embed(['Connection check']);
  console.log('Provider checks passed. Indexing', files.length, 'PDFs.');

  for (const filename of files) {
    console.log('Reading:', path.basename(filename));
    const result = await ingest(await readFile(filename), path.basename(filename));
    console.log(JSON.stringify({ ...result.document, duplicate: result.duplicate }));
  }
} catch (error) {
  // Provider errors can contain request internals; print only controlled messages.
  console.error(
    'Indexing stopped:',
    error.name === 'AppError' || error.constructor.name === 'AppError'
      ? error.message
      : error.name,
  );
  if (error.cause?.code) console.error('Connection error:', error.cause.code);
  process.exitCode = 1;
}
