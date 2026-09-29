import { answerQuestion } from '../../../lib/rag.js';
import { AppError } from '../../../lib/providers.js';
import { checkOrigin, errorResponse } from '../../../lib/http.js';
export const runtime = 'nodejs';

export const maxDuration = 300;

// Incoming message validate karke RAG pipeline ko pass karo.
export async function POST(request) {
  try {
    checkOrigin(request);

    const raw = await request.text();
    if (raw.length > 50000) throw new AppError('Conversation is too long.', 413);

    let body;

    try {
      body = JSON.parse(raw);
    } catch {
      throw new AppError('Invalid request body.');
    }
    if (
      !body ||
      typeof body.message !== 'string' ||
      !body.message.trim() ||
      body.message.length > 4000
    )
      throw new AppError('Enter a message between 1 and 4,000 characters.');
    if (
      body.documentId != null &&
      (typeof body.documentId !== 'string' || !/^[a-f0-9]{64}$/.test(body.documentId))
    )
      throw new AppError('Invalid document selection.');

    // Sirf recent user/assistant messages ko model context mein rakho.
    const history = (Array.isArray(body.history) ? body.history : [])
      .slice(-6)
      .filter(
        (m) =>
          m && ['user', 'assistant'].includes(m.role) && typeof m.content === 'string',
      )
      .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

    return Response.json(
      await answerQuestion(body.message.trim(), history, body.documentId),
    );
  } catch (error) {
    return errorResponse(error);
  }
}
