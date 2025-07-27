import { SweetController } from '../../controllers/sweetController.js';
import { handleCors } from '../../utils/cors.js';
import { connectToDatabase } from '../../utils/db.js';
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
    
    // Handle search endpoint
    if (req.method === 'GET') {
      return await handleSearchSweets(req, res, decoded);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    
    console.error('Error in sweets search API:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
}

// GET /api/sweets/search - Search for sweets
async function handleSearchSweets(req, res, user) {
  try {
    console.log('🔍 Searching sweets for user:', user.email);

    const { name, category, minPrice, maxPrice, sort, order = 'asc' } = req.query;

    const searchParams = { name, category, minPrice, maxPrice };
    const sorting = { sort, order };

    let result;
    try {
      result = await SweetController.searchSweets(searchParams, sorting);
    } catch (error) {
      if (error.message.includes('Invalid price parameters') ||
          error.message.includes('minPrice cannot be greater than maxPrice')) {
        return res.status(400).json({ error: error.message });
      }
      throw error;
    }

    // Ensure correct message for no results
    if (result.sweets && result.sweets.length === 0) {
      result.message = 'No sweets found matching search criteria';
    }
    res.status(200).json(result);
  } catch (error) {
    console.error('Error searching sweets:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
}
