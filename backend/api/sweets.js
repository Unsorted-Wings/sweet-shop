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


/**
 * GET /api/sweets/search
 * Search for sweets by name, category, or price range
 * Requires authentication (both customer and admin can search)
 */
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice, sort, order = 'asc' } = req.query;
    
    // Validate price parameters
    if ((minPrice && isNaN(parseFloat(minPrice))) || (maxPrice && isNaN(parseFloat(maxPrice)))) {
      return res.status(400).json({
        error: 'Invalid price parameters. minPrice and maxPrice must be valid numbers.'
      });
    }
    
    const minPriceNum = minPrice ? parseFloat(minPrice) : null;
    const maxPriceNum = maxPrice ? parseFloat(maxPrice) : null;
    
    // Validate price range
    if (minPriceNum && maxPriceNum && minPriceNum > maxPriceNum) {
      return res.status(400).json({
        error: 'minPrice cannot be greater than maxPrice'
      });
    }
    
    // Build search filter object
    const filter = {};
    
    // Add name search (case-insensitive regex)
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }
    
    // Add category filter
    if (category) {
      filter.category = category;
    }
    
    // Add price range filter
    if (minPriceNum || maxPriceNum) {
      filter.price = {};
      if (minPriceNum) filter.price.$gte = minPriceNum;
      if (maxPriceNum) filter.price.$lte = maxPriceNum;
    }
    
    // Find sweets with search filters
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
        message: 'No sweets found matching search criteria',
        sweets: []
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Found ${sweets.length} sweet${sweets.length === 1 ? '' : 's'} matching search criteria`,
      sweets
    });
  } catch (error) {
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
    const { name, price, category, quantity } = req.body;
    
    // Reject quantity updates - should use dedicated endpoints
    if (quantity !== undefined) {
      return res.status(400).json({
        error: 'Quantity cannot be updated via PUT. Use restock/purchase endpoints.'
      });
    }
    
    // Build update object (excluding quantity)
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = price;
    if (category !== undefined) updateData.category = category;
    
    // Update sweet with validation
    const updatedSweet = await Sweet.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedSweet) {
      return res.status(404).json({
        error: 'Sweet not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Sweet updated successfully',
      sweet: updatedSweet
    });
  } catch (error) {
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
