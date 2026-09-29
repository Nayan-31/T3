import { readLibrary } from '../../../lib/store.js';
import { ingest } from '../../../lib/ingest.js';
import { configuration, AppError } from '../../../lib/providers.js';
import { checkOrigin, errorResponse } from '../../../lib/http.js';
export const runtime = 'nodejs';

export const maxDuration = 300;

// Bookshelf ke documents aur setup readiness return karo.
export async function GET() {
  try {
    return Response.json({
      documents: (await readLibrary()).documents,
      configuration: configuration(),
    });
  } catch (error) {
    return errorResponse(error);
  }
}

// PDF validate karke ingestion pipeline start karo.
export async function POST(request) {
  try {
    checkOrigin(request);
    if (Number(request.headers.get('content-length')) > 26 * 1024 * 1024)
      throw new AppError('Maximum PDF size is 25 MB.', 413);

    const form = await request.formData();

    const file = form.get('file');
    if (!(file instanceof File) || !file.name.toLowerCase().endsWith('.pdf'))
      throw new AppError('Choose a PDF file.');
    if (!file.size || file.size > 25 * 1024 * 1024)
      throw new AppError('Choose a nonempty PDF up to 25 MB.', 413);

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!buffer.subarray(0, 1024).includes(Buffer.from('%PDF-')))
      throw new AppError('This file is not a valid PDF.');

    const name = file.name.replace(/[\\/\x00-\x1f]/g, '_').slice(0, 180);

    return Response.json(await ingest(buffer, name));
  } catch (error) {
    return errorResponse(error);
  }
}
