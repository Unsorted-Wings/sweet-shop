import { SweetController } from '../controllers/sweetController.js';
import { handleCors } from '../utils/cors.js';
import { connectToDatabase } from '../utils/db.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) {
    return; // Was a preflight request, already handled
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
    
    // Route to appropriate handler based on method
    if (req.method === 'GET') {
      return await handleGetSweets(req, res, decoded);
    } else if (req.method === 'POST') {
      return await handleCreateSweet(req, res, decoded);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    
    console.error('Error in sweets API:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
}

// GET /api/sweets - Get all sweets
async function handleGetSweets(req, res, user) {
  try {
    console.log('📦 Fetching sweets for user:', user.email);
    
    const { category } = req.query;
    const { sort, order = 'asc' } = req.query;
    
    const filters = {};
    if (category) {
      filters.category = category;
    }
    
    const sorting = { sort, order };
    
    const result = await SweetController.getAllSweets(filters, sorting);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching sweets:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
}

// POST /api/sweets - Create a new sweet (admin only)
async function handleCreateSweet(req, res, user) {
  try {
    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin role required' });
    }
    
    const result = await SweetController.createSweet(req.body);
    res.status(201).json(result);
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: `Validation failed: ${error.message}`
      });
    }

    console.error('Error creating sweet:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
}
