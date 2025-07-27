import Sweet from '../models/Sweet.js';

export class SweetController {
  /**
   * Create a new sweet
   * @param {Object} sweetData - Sweet data from request body
   * @returns {Object} Success response with created sweet
   * @throws {Error} Validation or database errors
   */
  static async createSweet(sweetData) {
    const sweet = new Sweet(sweetData);
    const savedSweet = await sweet.save();
    
    return {
      success: true,
      message: 'Sweet created successfully',
      sweet: savedSweet
    };
  }

  /**
   * Get all sweets with optional filtering and sorting
   * @param {Object} filters - Filter parameters (category, etc.)
   * @param {Object} sorting - Sort parameters (sort, order)
   * @returns {Object} Success response with sweets array
   * @throws {Error} Database errors
   */
  static async getAllSweets(filters = {}, sorting = {}) {
    let query = Sweet.find(filters);
    
    // Add sorting if specified
    if (sorting.sort) {
      const sortOrder = sorting.order === 'desc' ? -1 : 1;
      query = query.sort({ [sorting.sort]: sortOrder });
    }
    
    const sweets = await query;
    
    const message = sweets.length === 0 
      ? 'No sweets found'
      : `Found ${sweets.length} sweet${sweets.length === 1 ? '' : 's'}`;
    
    return {
      success: true,
      message,
      sweets
    };
  }

  /**
   * Search sweets by name, category, or price range
   * @param {Object} searchParams - Search parameters
   * @param {string} searchParams.name - Name to search for
   * @param {string} searchParams.category - Category to filter by
   * @param {number} searchParams.minPrice - Minimum price
   * @param {number} searchParams.maxPrice - Maximum price
   * @param {Object} sorting - Sort parameters (sort, order)
   * @returns {Object} Success response with matching sweets
   * @throws {Error} Validation or database errors
   */
  static async searchSweets(searchParams, sorting = {}) {
    const { name, category, minPrice, maxPrice } = searchParams;
    
    // Validate price parameters
    if ((minPrice && isNaN(parseFloat(minPrice))) || (maxPrice && isNaN(parseFloat(maxPrice)))) {
      throw new Error('Invalid price parameters. minPrice and maxPrice must be valid numbers.');
    }
    
    const minPriceNum = minPrice ? parseFloat(minPrice) : null;
    const maxPriceNum = maxPrice ? parseFloat(maxPrice) : null;
    
    // Validate price range
    if (minPriceNum && maxPriceNum && minPriceNum > maxPriceNum) {
      throw new Error('minPrice cannot be greater than maxPrice');
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
    if (sorting.sort) {
      const sortOrder = sorting.order === 'desc' ? -1 : 1;
      query = query.sort({ [sorting.sort]: sortOrder });
    }
    
    const sweets = await query;
    
    const message = sweets.length === 0 
      ? 'No sweets found matching search criteria'
      : `Found ${sweets.length} sweet${sweets.length === 1 ? '' : 's'} matching search criteria`;
    
    return {
      success: true,
      message,
      sweets
    };
  }

  /**
   * Update sweet details (name, price, category only - NOT quantity)
   * @param {string} id - Sweet ID
   * @param {Object} updateData - Update data from request body
   * @returns {Object|null} Success response with updated sweet or null if not found
   * @throws {Error} Validation or database errors
   */
  static async updateSweet(id, updateData) {
    // Reject quantity updates - should use dedicated endpoints
    if (updateData.quantity !== undefined) {
      throw new Error('Quantity cannot be updated via PUT. Use restock/purchase endpoints.');
    }
    
    // Build update object (excluding quantity)
    const allowedFields = ['name', 'price', 'category'];
    const filteredUpdateData = {};
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        filteredUpdateData[field] = updateData[field];
      }
    });
    
    // Update sweet with validation
    const updatedSweet = await Sweet.findByIdAndUpdate(
      id,
      filteredUpdateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedSweet) {
      return null;
    }
    
    return {
      success: true,
      message: 'Sweet updated successfully',
      sweet: updatedSweet
    };
  }

  /**
   * Delete a sweet by ID
   * @param {string} id - Sweet ID
   * @returns {Object|null} Success response with deleted sweet or null if not found
   * @throws {Error} Database errors
   */
  static async deleteSweet(id) {
    const deletedSweet = await Sweet.findByIdAndDelete(id);
    
    if (!deletedSweet) {
      return null;
    }
    
    return {
      success: true,
      message: 'Sweet deleted successfully',
      sweet: deletedSweet
    };
  }

  /**
   * Get a sweet by ID
   * @param {string} id - Sweet ID
   * @returns {Object|null} Success response with sweet or null if not found
   * @throws {Error} Database errors
   */
  static async getSweetById(id) {
    const sweet = await Sweet.findById(id);
    
    if (!sweet) {
      return null;
    }
    
    return {
      success: true,
      sweet
    };
  }
}
