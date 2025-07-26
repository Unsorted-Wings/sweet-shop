import express from 'express';
import Sweet from '../models/Sweet.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/sweets
 * Create a new sweet
 * Requires admin authentication
 */
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
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

/**
 * GET /api/sweets
 * Get all sweets with optional filtering and sorting
 * Requires authentication (both customer and admin can view)
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { category, sort, order = 'asc' } = req.query;
    
    // Build filter object
    const filter = {};
    if (category) {
      filter.category = category;
    }
    
    // Find sweets with optional filtering
    let query = Sweet.find(filter);
    
    // Add sorting if specified
    if (sort) {
      const sortOrder = order === 'desc' ? -1 : 1;
      query = query.sort({ [sort]: sortOrder });
    }
    
    const sweets = await query;
    
    // Return results
    if (sweets.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No sweets found',
        sweets: []
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Found ${sweets.length} sweet${sweets.length === 1 ? '' : 's'}`,
      sweets
    });
  } catch (error) {
    console.error('Error fetching sweets:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

export default router;
