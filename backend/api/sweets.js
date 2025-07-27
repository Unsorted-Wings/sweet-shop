import express from 'express';
import { SweetController } from '../controllers/sweetController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/sweets
 * Create a new sweet
 * Requires admin authentication
 */
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await SweetController.createSweet(req.body);
    res.status(201).json(result);
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
});


/**
 * GET /api/sweets/search
 * Search for sweets by name, category, or price range
 * Requires authentication (both customer and admin can search)
 */
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice, sort, order = 'asc' } = req.query;
    
    const searchParams = { name, category, minPrice, maxPrice };
    const sorting = { sort, order };
    
    const result = await SweetController.searchSweets(searchParams, sorting);
    res.status(200).json(result);
  } catch (error) {
    // Handle validation errors
    if (error.message.includes('Invalid price parameters') || 
        error.message.includes('minPrice cannot be greater than maxPrice')) {
      return res.status(400).json({
        error: error.message
      });
    }

    console.error('Error searching sweets:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

/**
 * PUT /api/sweets/:id
 * Update sweet details (name, price, category only - NOT quantity)
 * Requires admin authentication
 * Note: Use restock/purchase endpoints for quantity management
 */
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await SweetController.updateSweet(id, req.body);
    
    if (!result) {
      return res.status(404).json({
        error: 'Sweet not found'
      });
    }
    
    res.status(200).json(result);
  } catch (error) {
    // Handle quantity update rejection
    if (error.message.includes('Quantity cannot be updated via PUT')) {
      return res.status(400).json({
        error: error.message
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: `Validation failed: ${error.message}`
      });
    }
    
    console.error('Error updating sweet:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

export default router;
