import { AuthController, ValidationError, AuthenticationError } from '../../controllers/authController.js';

const authController = new AuthController();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await authController.loginUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    
    if (error instanceof AuthenticationError) {
      return res.status(401).json({ error: error.message });
    }
    
    // Log unexpected errors in production
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
