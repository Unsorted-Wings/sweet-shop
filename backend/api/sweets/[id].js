import { SweetController } from '../../controllers/sweetController.js';
import { handleCors } from '../../utils/cors.js';
import { connectToDatabase } from '../../utils/db.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Conditionally handle CORS (skip in test environment)
  if (process.env.NODE_ENV !== 'test') {
    if (handleCors(req, res)) {
      return; // Was a preflight request, already handled
    }
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

    // Route to appropriate handler based on method
    if (req.method === 'GET') {
      return await handleGetSweet(req, res, decoded, id);
    } else if (req.method === 'PUT') {
      return await handleUpdateSweet(req, res, decoded, id);
    } else if (req.method === 'DELETE') {
      return await handleDeleteSweet(req, res, decoded, id);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Handle validation errors for PUT
    if (req.method === 'PUT') {
      if (error.message && error.message.includes('Quantity cannot be updated via PUT')) {
        return res.status(400).json({ error: error.message });
      }
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: `Validation failed: ${error.message}` });
      }
    }

    console.error('Error in sweet detail API:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}

// GET /api/sweets/[id] - Get single sweet
async function handleGetSweet(req, res, user, id) {
  try {
    console.log('🍰 Getting sweet', id, 'for user:', user.email);

    const result = await SweetController.getSweetById(id);

    if (!result) {
      return res.status(404).json({
        error: 'Sweet not found',
      });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting sweet:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}

// PUT /api/sweets/[id] - Update sweet (admin only)
async function handleUpdateSweet(req, res, user, id) {
  try {
    // Check if user is admin
    if (user.role !== 'admin') {
      return res
        .status(403)
        .json({ error: 'Access denied. admin role required' });
    }

    const result = await SweetController.updateSweet(id, req.body);

    if (!result) {
      return res.status(404).json({
        error: 'Sweet not found',
      });
    }

    res.status(200).json(result);
  } catch (error) {
    // Handle quantity update rejection
    if (error.message.includes('Quantity cannot be updated via PUT')) {
      return res.status(400).json({
        error: error.message,
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: `Validation failed: ${error.message}`,
      });
    }

    console.error('Error updating sweet:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}

// DELETE /api/sweets/[id] - Delete sweet (admin only)
async function handleDeleteSweet(req, res, user, id) {
  try {
    // Check if user is admin
    if (user.role !== 'admin') {
      return res
        .status(403)
        .json({ error: 'Access denied. admin role required' });
    }

    const result = await SweetController.deleteSweet(id);

    if (!result) {
      return res.status(404).json({
        error: 'Sweet not found',
      });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error deleting sweet:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}
