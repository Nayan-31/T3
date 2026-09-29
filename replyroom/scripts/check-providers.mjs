import { Pinecone } from '@pinecone-database/pinecone';
import { embed } from '../lib/providers.js';

try {
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  const result = await pc.indexes.list();
  console.log(
    'Available indexes:',
    JSON.stringify(
      (result.indexes || []).map((i) => ({
        name: i.name,
        dimension: i.dimension,
        metric: i.metric,
      })),
    ),
  );
  const stats = await pc.index({ name: process.env.PINECONE_INDEX }).describeIndexStats();
  console.log(
    'Project namespace records:',
    stats.namespaces?.[process.env.PINECONE_NAMESPACE || 'replyroom-v1']?.recordCount ||
      0,
  );
} catch (error) {
  console.log('Pinecone check:', error.name);
}
try {
  const vectors = await embed(['Connection check']);
  console.log('Mistral embeddings OK:', vectors[0].length, 'dimensions');
} catch (error) {
  console.log(
    'Mistral check:',
    error.constructor.name === 'AppError' ? error.message : error.name,
  );
}
