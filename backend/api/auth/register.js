import { AuthController, ValidationError, ConflictError } from '../../controllers/authController.js';
import { handleCors } from '../../utils/cors.js';

const authController = new AuthController();

export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) {
    return; // Was a preflight request, already handled
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await authController.registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof ValidationError || error instanceof ConflictError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    
    // Log unexpected errors in production
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
