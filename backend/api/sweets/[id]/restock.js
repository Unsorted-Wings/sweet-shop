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

    // Check if user is admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. admin role required' });
    }

    // Get sweet ID from URL
    const { id } = req.query;
    const { quantity } = req.body || {};

    if (quantity === undefined || quantity === null) {
      return res.status(400).json({ error: 'Quantity is required for restocking' });
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ error: 'Restock quantity must be a positive integer' });
    }

    console.log('📦 Processing restock for sweet', id, 'quantity:', quantity, 'admin:', decoded.email);

    let result;
    try {
      result = await SweetController.restockSweet(id, quantity);
    } catch (error) {
      // If SweetController throws validation error, return 400
      if (error.message && error.message.includes('Restock quantity must be a positive integer')) {
        return res.status(400).json({ error: error.message });
      }
      throw error;
    }

    if (!result) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    res.status(200).json(result);

  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    console.error('Error restocking sweet:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
