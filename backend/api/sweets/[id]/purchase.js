import { SweetController } from '../../../controllers/sweetController.js';
import { handleCors } from '../../../utils/cors.js';
import { connectToDatabase } from '../../../utils/db.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) {
    return; // Was a preflight request, already handled
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Connect to database
    await connectToDatabase();
    
    // Check authentication for all requests
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token is required' });
    }
    
    const token = authHeader.substring(7);
    
    if (!token || !token.trim()) {
      return res.status(401).json({ error: 'Invalid token format' });
    }
    
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get sweet ID from URL
    const { id } = req.query;
    const { quantity = 1 } = req.body || {};
    
    console.log('🛒 Processing purchase for sweet', id, 'quantity:', quantity, 'user:', decoded.email);
    
    const result = await SweetController.purchaseSweet(id, quantity);
    
    if (!result) {
      return res.status(404).json({
        error: 'Sweet not found'
      });
    }
    
    res.status(200).json(result);
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    
    // Handle validation errors and insufficient stock
    if (error.message.includes('quantity must be a positive integer') ||
        error.message.includes('Insufficient stock')) {
      return res.status(400).json({
        error: error.message
      });
    }
    
    console.error('Error purchasing sweet:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
}
