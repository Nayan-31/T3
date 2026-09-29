import { AppError } from './providers.js';
export function checkOrigin(request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin)
    throw new AppError('Cross-origin requests are not allowed.', 403);
}

export function errorResponse(error) {
  if (error instanceof AppError)
    return Response.json({ error: error.message }, { status: error.status });

  // Avoid returning provider internals or logging conversation/document content.
  console.error('Request failed:', error?.name || 'UnknownError');

  return Response.json(
    {
      error:
        'The request failed. Check your provider configuration and connection, then retry.',
    },
    { status: 500 },
  );
}
