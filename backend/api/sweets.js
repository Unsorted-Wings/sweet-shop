import express from 'express';
import Sweet from '../models/Sweet.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/sweets
 * Create a new sweet
 * Requires authentication
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, price, category, quantity } = req.body;

    // Create new sweet instance
    const sweet = new Sweet({
      name,
      price,
      category,
      quantity
    });

    // Save to database
    const savedSweet = await sweet.save();

    res.status(201).json({
      success: true,
      message: 'Sweet created successfully',
      sweet: savedSweet
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: `Validation failed: ${error.message}`
      });
    }

    // Handle other errors
    console.error('Error creating sweet:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

export default router;
