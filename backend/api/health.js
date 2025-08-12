import { handleCors } from '../utils/cors.js';

export default async function handler(req, res) {
  // Conditionally handle CORS (skip in test environment)
  if (process.env.NODE_ENV !== 'test') {
    if (handleCors(req, res)) {
      return; // Was a preflight request, already handled
    }
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.status(200).json({ status: 'ok' });
}
