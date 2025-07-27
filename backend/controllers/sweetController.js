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
    if ((minPrice !== undefined && minPrice !== null && minPrice !== '' && isNaN(parseFloat(minPrice))) ||
        (maxPrice !== undefined && maxPrice !== null && maxPrice !== '' && isNaN(parseFloat(maxPrice)))) {
      throw new Error('Invalid price parameters. minPrice and maxPrice must be valid numbers.');
    }

    const minPriceNum = minPrice !== undefined && minPrice !== null && minPrice !== '' ? parseFloat(minPrice) : undefined;
    const maxPriceNum = maxPrice !== undefined && maxPrice !== null && maxPrice !== '' ? parseFloat(maxPrice) : undefined;

    // Validate price range
    if (minPriceNum !== undefined && maxPriceNum !== undefined && minPriceNum > maxPriceNum) {
      throw new Error('minPrice cannot be greater than maxPrice');
    }

    // Build search filter object
    const filter = {};
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }
    if (category) {
      filter.category = category;
    }
    if (minPriceNum !== undefined || maxPriceNum !== undefined) {
      const priceFilter = {};
      if (minPriceNum !== undefined) priceFilter.$gte = minPriceNum;
      if (maxPriceNum !== undefined) priceFilter.$lte = maxPriceNum;
      if (Object.keys(priceFilter).length > 0) {
        filter.price = priceFilter;
      }
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
      if (Object.prototype.hasOwnProperty.call(updateData, field)) {
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

  /**
   * Purchase a sweet (decrease quantity)
   * @param {string} id - Sweet ID
   * @param {number} quantity - Quantity to purchase (default: 1)
   * @returns {Object|null} Success response with updated sweet or null if not found
   * @throws {Error} Validation or insufficient stock errors
   */
  static async purchaseSweet(id, quantity = 1) {
    // Validate quantity
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('Purchase quantity must be a positive integer');
    }
    
    // Find the sweet first to check current stock
    const sweet = await Sweet.findById(id);
    
    if (!sweet) {
      return null;
    }
    
    // Check if there's enough stock
    if (sweet.quantity < quantity) {
      throw new Error(`Insufficient stock. Available: ${sweet.quantity}, Requested: ${quantity}`);
    }
    
    // Update the quantity
    const updatedSweet = await Sweet.findByIdAndUpdate(
      id,
      { $inc: { quantity: -quantity } },
      { new: true, runValidators: true }
    );
    
    return {
      success: true,
      message: `Successfully purchased ${quantity} unit${quantity === 1 ? '' : 's'} of ${updatedSweet.name}`,
      sweet: updatedSweet,
      purchaseDetails: {
        quantityPurchased: quantity,
        remainingStock: updatedSweet.quantity
      }
    };
  }

  /**
   * Restock a sweet (increase quantity) - Admin only
   * @param {string} id - Sweet ID
   * @param {number} quantity - Quantity to restock
   * @returns {Object|null} Success response with updated sweet or null if not found
   * @throws {Error} Validation errors
   */
  static async restockSweet(id, quantity) {
    // Validate quantity
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('Restock quantity must be a positive integer');
    }
    
    // Update the quantity
    const updatedSweet = await Sweet.findByIdAndUpdate(
      id,
      { $inc: { quantity: quantity } },
      { new: true, runValidators: true }
    );
    
    if (!updatedSweet) {
      return null;
    }
    
    return {
      success: true,
      message: `Successfully restocked ${quantity} unit${quantity === 1 ? '' : 's'} of ${updatedSweet.name}`,
      sweet: updatedSweet,
      restockDetails: {
        quantityAdded: quantity,
        newStock: updatedSweet.quantity
      }
    };
  }
}
