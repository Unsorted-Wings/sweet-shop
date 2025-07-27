import { jest } from '@jest/globals';

// Mock the Sweet model
const mockSweetSave = jest.fn();
const mockSweetFind = jest.fn();
const mockSweetFindById = jest.fn();
const mockSweetFindByIdAndUpdate = jest.fn();
const mockSweetFindByIdAndDelete = jest.fn();

const mockSweet = jest.fn().mockImplementation((data) => ({
  ...data,
  _id: 'sweet123',
  save: mockSweetSave
}));

// Add static methods
mockSweet.find = mockSweetFind;
mockSweet.findById = mockSweetFindById;
mockSweet.findByIdAndUpdate = mockSweetFindByIdAndUpdate;
mockSweet.findByIdAndDelete = mockSweetFindByIdAndDelete;

jest.unstable_mockModule('../../models/Sweet.js', () => ({
  default: mockSweet,
  Sweet: mockSweet
}));

// Import the controller after mocking
const { SweetController } = await import('../../controllers/sweetController.js');

describe('SweetController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createSweet', () => {
    const validSweetData = {
      name: 'Chocolate Cake',
      price: 25.99,
      category: 'cake',
      quantity: 10
    };

    it('should create a new sweet successfully', async () => {
      const savedSweet = {
        _id: 'sweet123',
        ...validSweetData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockSweetSave.mockResolvedValue(savedSweet);

      const result = await SweetController.createSweet(validSweetData);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Sweet created successfully');
      expect(result.sweet).toEqual(savedSweet);
      expect(mockSweet).toHaveBeenCalledWith(validSweetData);
      expect(mockSweetSave).toHaveBeenCalledTimes(1);
    });

    it('should handle validation errors', async () => {
      const validationError = new Error('Validation failed: name is required');
      validationError.name = 'ValidationError';
      mockSweetSave.mockRejectedValue(validationError);

      await expect(SweetController.createSweet({})).rejects.toThrow('Validation failed: name is required');
    });

    it('should handle database errors', async () => {
      const dbError = new Error('Database connection failed');
      mockSweetSave.mockRejectedValue(dbError);

      await expect(SweetController.createSweet(validSweetData)).rejects.toThrow('Database connection failed');
    });
  });

  describe('getAllSweets', () => {
    it('should return all sweets with no filters', async () => {
      const mockSweets = [
        { _id: 'sweet1', name: 'Cake', price: 25.99, category: 'cake', quantity: 10 },
        { _id: 'sweet2', name: 'Cookie', price: 12.50, category: 'cookie', quantity: 20 }
      ];

      mockSweetFind.mockResolvedValue(mockSweets);

      const result = await SweetController.getAllSweets();

      expect(result.success).toBe(true);
      expect(result.sweets).toEqual(mockSweets);
      expect(result.message).toBe('Found 2 sweets');
      expect(mockSweetFind).toHaveBeenCalledWith({});
    });

    it('should return filtered sweets with category filter', async () => {
      const mockSweets = [
        { _id: 'sweet1', name: 'Cake', price: 25.99, category: 'cake', quantity: 10 }
      ];

      const mockSortedQuery = {
        sort: jest.fn().mockResolvedValue(mockSweets)
      };
      mockSweetFind.mockReturnValue(mockSortedQuery);

      const filters = { category: 'cake' };
      const sorting = { sort: 'price', order: 'asc' };

      const result = await SweetController.getAllSweets(filters, sorting);

      expect(result.success).toBe(true);
      expect(result.sweets).toEqual(mockSweets);
      expect(mockSweetFind).toHaveBeenCalledWith(filters);
      expect(mockSortedQuery.sort).toHaveBeenCalledWith({ price: 1 });
    });

    it('should return empty result when no sweets found', async () => {
      mockSweetFind.mockResolvedValue([]);

      const result = await SweetController.getAllSweets();

      expect(result.success).toBe(true);
      expect(result.sweets).toEqual([]);
      expect(result.message).toBe('No sweets found');
    });

    it('should handle database errors', async () => {
      mockSweetFind.mockRejectedValue(new Error('Database connection failed'));

      await expect(SweetController.getAllSweets()).rejects.toThrow('Database connection failed');
    });
  });

  describe('searchSweets', () => {
    it('should search sweets by name', async () => {
      const mockSweets = [
        { _id: 'sweet1', name: 'Chocolate Cake', price: 25.99, category: 'cake', quantity: 10 }
      ];

      mockSweetFind.mockResolvedValue(mockSweets);

      const searchParams = { name: 'Chocolate' };
      const result = await SweetController.searchSweets(searchParams);

      expect(result.success).toBe(true);
      expect(result.sweets).toEqual(mockSweets);
      expect(result.message).toBe('Found 1 sweet matching search criteria');
      expect(mockSweetFind).toHaveBeenCalledWith({
        name: { $regex: 'Chocolate', $options: 'i' }
      });
    });

    it('should search sweets by price range', async () => {
      const mockSweets = [
        { _id: 'sweet2', name: 'Cookie', price: 15.50, category: 'cookie', quantity: 20 }
      ];

      mockSweetFind.mockResolvedValue(mockSweets);

      const searchParams = { minPrice: 10, maxPrice: 20 };
      const result = await SweetController.searchSweets(searchParams);

      expect(result.success).toBe(true);
      expect(result.sweets).toEqual(mockSweets);
      expect(mockSweetFind).toHaveBeenCalledWith({
        price: { $gte: 10, $lte: 20 }
      });
    });

    it('should validate price parameters', async () => {
      const searchParams = { minPrice: 'invalid' };

      await expect(SweetController.searchSweets(searchParams)).rejects.toThrow('Invalid price parameters');
    });

    it('should validate price range logic', async () => {
      const searchParams = { minPrice: 30, maxPrice: 20 };

      await expect(SweetController.searchSweets(searchParams)).rejects.toThrow('minPrice cannot be greater than maxPrice');
    });

    it('should return empty results when no matches found', async () => {
      mockSweetFind.mockResolvedValue([]);

      const searchParams = { name: 'NonexistentSweet' };
      const result = await SweetController.searchSweets(searchParams);

      expect(result.success).toBe(true);
      expect(result.sweets).toEqual([]);
      expect(result.message).toBe('No sweets found matching search criteria');
    });
  });

  describe('updateSweet', () => {
    const updateData = {
      name: 'Updated Cake',
      price: 30.99,
      category: 'cake'
    };

    it('should update sweet successfully', async () => {
      const updatedSweet = {
        _id: 'sweet123',
        ...updateData,
        quantity: 10,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      };

      mockSweetFindByIdAndUpdate.mockResolvedValue(updatedSweet);

      const result = await SweetController.updateSweet('sweet123', updateData);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Sweet updated successfully');
      expect(result.sweet).toEqual(updatedSweet);
      expect(mockSweetFindByIdAndUpdate).toHaveBeenCalledWith(
        'sweet123',
        updateData,
        { new: true, runValidators: true }
      );
    });

    it('should reject quantity updates', async () => {
      const invalidData = { ...updateData, quantity: 20 };

      await expect(SweetController.updateSweet('sweet123', invalidData))
        .rejects.toThrow('Quantity cannot be updated via PUT. Use restock/purchase endpoints.');
    });

    it('should return null when sweet not found', async () => {
      mockSweetFindByIdAndUpdate.mockResolvedValue(null);

      const result = await SweetController.updateSweet('nonexistent123', updateData);

      expect(result).toBeNull();
    });

    it('should handle validation errors', async () => {
      const validationError = new Error('Validation failed: price must be positive');
      validationError.name = 'ValidationError';
      mockSweetFindByIdAndUpdate.mockRejectedValue(validationError);

      await expect(SweetController.updateSweet('sweet123', { price: -10 }))
        .rejects.toThrow('Validation failed: price must be positive');
    });
  });

  describe('deleteSweet', () => {
    it('should delete sweet successfully', async () => {
      const deletedSweet = {
        _id: 'sweet123',
        name: 'Chocolate Cake',
        price: 25.99,
        category: 'cake',
        quantity: 10
      };

      mockSweetFindByIdAndDelete.mockResolvedValue(deletedSweet);

      const result = await SweetController.deleteSweet('sweet123');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Sweet deleted successfully');
      expect(result.sweet).toEqual(deletedSweet);
      expect(mockSweetFindByIdAndDelete).toHaveBeenCalledWith('sweet123');
    });

    it('should return null when sweet not found', async () => {
      mockSweetFindByIdAndDelete.mockResolvedValue(null);

      const result = await SweetController.deleteSweet('nonexistent123');

      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      mockSweetFindByIdAndDelete.mockRejectedValue(new Error('Database connection failed'));

      await expect(SweetController.deleteSweet('sweet123'))
        .rejects.toThrow('Database connection failed');
    });
  });

  describe('getSweetById', () => {
    it('should return sweet by ID successfully', async () => {
      const sweet = {
        _id: 'sweet123',
        name: 'Chocolate Cake',
        price: 25.99,
        category: 'cake',
        quantity: 10
      };

      mockSweetFindById.mockResolvedValue(sweet);

      const result = await SweetController.getSweetById('sweet123');

      expect(result.success).toBe(true);
      expect(result.sweet).toEqual(sweet);
      expect(mockSweetFindById).toHaveBeenCalledWith('sweet123');
    });

    it('should return null when sweet not found', async () => {
      mockSweetFindById.mockResolvedValue(null);

      const result = await SweetController.getSweetById('nonexistent123');

      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      mockSweetFindById.mockRejectedValue(new Error('Database connection failed'));

      await expect(SweetController.getSweetById('sweet123'))
        .rejects.toThrow('Database connection failed');
    });
  });

  describe('purchaseSweet', () => {
    let mockSweetFindByIdAndUpdate;

    beforeEach(() => {
      mockSweetFindByIdAndUpdate = jest.fn();
      mockSweet.findByIdAndUpdate = mockSweetFindByIdAndUpdate;
    });

    it('should purchase sweet successfully with default quantity', async () => {
      const sweet = {
        _id: 'sweet123',
        name: 'Chocolate Cake',
        price: 25.99,
        category: 'cake',
        quantity: 10
      };

      const updatedSweet = { ...sweet, quantity: 9 };

      mockSweetFindById.mockResolvedValue(sweet);
      mockSweetFindByIdAndUpdate.mockResolvedValue(updatedSweet);

      const result = await SweetController.purchaseSweet('sweet123');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Successfully purchased 1 unit of Chocolate Cake');
      expect(result.sweet.quantity).toBe(9);
      expect(result.purchaseDetails.quantityPurchased).toBe(1);
      expect(result.purchaseDetails.remainingStock).toBe(9);
      expect(mockSweetFindByIdAndUpdate).toHaveBeenCalledWith(
        'sweet123',
        { $inc: { quantity: -1 } },
        { new: true, runValidators: true }
      );
    });

    it('should purchase sweet successfully with specified quantity', async () => {
      const sweet = {
        _id: 'sweet123',
        name: 'Chocolate Cookies',
        price: 15.99,
        category: 'cookie',
        quantity: 20
      };

      const updatedSweet = { ...sweet, quantity: 15 };

      mockSweetFindById.mockResolvedValue(sweet);
      mockSweetFindByIdAndUpdate.mockResolvedValue(updatedSweet);

      const result = await SweetController.purchaseSweet('sweet123', 5);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Successfully purchased 5 units of Chocolate Cookies');
      expect(result.sweet.quantity).toBe(15);
      expect(result.purchaseDetails.quantityPurchased).toBe(5);
      expect(result.purchaseDetails.remainingStock).toBe(15);
      expect(mockSweetFindByIdAndUpdate).toHaveBeenCalledWith(
        'sweet123',
        { $inc: { quantity: -5 } },
        { new: true, runValidators: true }
      );
    });

    it('should return null when sweet not found', async () => {
      mockSweetFindById.mockResolvedValue(null);

      const result = await SweetController.purchaseSweet('nonexistent123');

      expect(result).toBeNull();
      expect(mockSweetFindByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('should throw error for insufficient stock', async () => {
      const sweet = {
        _id: 'sweet123',
        name: 'Chocolate Cake',
        price: 25.99,
        category: 'cake',
        quantity: 3
      };

      mockSweetFindById.mockResolvedValue(sweet);

      await expect(SweetController.purchaseSweet('sweet123', 5))
        .rejects.toThrow('Insufficient stock. Available: 3, Requested: 5');
      
      expect(mockSweetFindByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('should throw error for invalid quantity (zero)', async () => {
      await expect(SweetController.purchaseSweet('sweet123', 0))
        .rejects.toThrow('Purchase quantity must be a positive integer');
      
      expect(mockSweetFindById).not.toHaveBeenCalled();
    });

    it('should throw error for invalid quantity (negative)', async () => {
      await expect(SweetController.purchaseSweet('sweet123', -1))
        .rejects.toThrow('Purchase quantity must be a positive integer');
      
      expect(mockSweetFindById).not.toHaveBeenCalled();
    });

    it('should throw error for invalid quantity (non-integer)', async () => {
      await expect(SweetController.purchaseSweet('sweet123', 2.5))
        .rejects.toThrow('Purchase quantity must be a positive integer');
      
      expect(mockSweetFindById).not.toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      mockSweetFindById.mockRejectedValue(new Error('Database connection failed'));

      await expect(SweetController.purchaseSweet('sweet123', 1))
        .rejects.toThrow('Database connection failed');
    });
  });

  describe('restockSweet', () => {
    let mockSweetFindByIdAndUpdate;

    beforeEach(() => {
      mockSweetFindByIdAndUpdate = jest.fn();
      mockSweet.findByIdAndUpdate = mockSweetFindByIdAndUpdate;
    });

    it('should restock sweet successfully', async () => {
      const updatedSweet = {
        _id: 'sweet123',
        name: 'Chocolate Cake',
        price: 25.99,
        category: 'cake',
        quantity: 15
      };

      mockSweetFindByIdAndUpdate.mockResolvedValue(updatedSweet);

      const result = await SweetController.restockSweet('sweet123', 5);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Successfully restocked 5 units of Chocolate Cake');
      expect(result.sweet.quantity).toBe(15);
      expect(result.restockDetails.quantityAdded).toBe(5);
      expect(result.restockDetails.newStock).toBe(15);
      expect(mockSweetFindByIdAndUpdate).toHaveBeenCalledWith(
        'sweet123',
        { $inc: { quantity: 5 } },
        { new: true, runValidators: true }
      );
    });

    it('should return null when sweet not found', async () => {
      mockSweetFindByIdAndUpdate.mockResolvedValue(null);

      const result = await SweetController.restockSweet('nonexistent123', 5);

      expect(result).toBeNull();
    });

    it('should throw error for invalid quantity (zero)', async () => {
      await expect(SweetController.restockSweet('sweet123', 0))
        .rejects.toThrow('Restock quantity must be a positive integer');
      
      expect(mockSweetFindByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('should throw error for invalid quantity (negative)', async () => {
      await expect(SweetController.restockSweet('sweet123', -1))
        .rejects.toThrow('Restock quantity must be a positive integer');
      
      expect(mockSweetFindByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('should throw error for invalid quantity (non-integer)', async () => {
      await expect(SweetController.restockSweet('sweet123', 2.5))
        .rejects.toThrow('Restock quantity must be a positive integer');
      
      expect(mockSweetFindByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      mockSweetFindByIdAndUpdate.mockRejectedValue(new Error('Database connection failed'));

      await expect(SweetController.restockSweet('sweet123', 5))
        .rejects.toThrow('Database connection failed');
    });
  });
});
