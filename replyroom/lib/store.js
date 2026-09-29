import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const directory = path.join(process.cwd(), '.data');

const filename = path.join(directory, 'library.json');

export async function readLibrary() {
  try {
    return JSON.parse(await readFile(filename, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return { documents: [], chunks: [] };
    throw error;
  }
}

// Serial writes for this single-process, local monolith; atomic rename avoids half-written JSON.
let tail = Promise.resolve();

export function commitDocument(document, chunks) {
  const job = tail.then(async () => {
    const library = await readLibrary();
    library.documents = library.documents
      .filter((d) => d.id !== document.id)
      .concat(document);
    library.chunks = library.chunks
      .filter((c) => c.documentId !== document.id)
      .concat(chunks);
    await mkdir(directory, { recursive: true });

    const temp = `${filename}.${randomUUID()}.tmp`;
    await writeFile(temp, JSON.stringify(library), { mode: 0o600 });
    await rename(temp, filename);
  });
  tail = job.catch(() => {});

  return job;
}
