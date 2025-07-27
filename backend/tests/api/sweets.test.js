import { jest } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';

// Mock the database connection first
jest.unstable_mockModule('../../utils/db.js', () => ({
  connectToDatabase: jest.fn().mockResolvedValue(true)
}));

// Mock the Sweet model
const mockSweetSave = jest.fn();
const mockSweetFind = jest.fn();
const mockSweetFindById = jest.fn();
const mockSweetFindByIdAndUpdate = jest.fn();
const mockSweetFindByIdAndDelete = jest.fn();

const mockSweet = jest.fn().mockImplementation((data) => {
  // Simulate validation errors like Mongoose would
  const validationErrors = [];
  
  if (!data.name) validationErrors.push('Name is required');
  if (!data.price) validationErrors.push('Price is required');
  if (!data.category) validationErrors.push('Category is required');
  if (data.quantity === undefined) validationErrors.push('Quantity is required');
  
  if (data.price && data.price <= 0) validationErrors.push('Price must be greater than 0');
  if (data.quantity && data.quantity < 0) validationErrors.push('Quantity must be non-negative');
  if (data.category && !['chocolate', 'candy', 'gummy', 'hard-candy', 'lollipop', 'toffee', 'fudge', 'marshmallow', 'cake', 'cookie', 'pastry'].includes(data.category)) {
    validationErrors.push('Invalid category');
  }
  
  const mockSaveInstance = jest.fn().mockImplementation(async () => {
    if (validationErrors.length > 0) {
      const error = new Error(validationErrors.join(', '));
      error.name = 'ValidationError';
      throw error;
    }
    
    // Call the shared mock only for successful saves
    mockSweetSave();
    
    return {
      _id: 'sweet123',
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  });
  
  return {
    ...data,
    _id: 'sweet123',
    save: mockSaveInstance
  };
});

// Add static methods
mockSweet.find = mockSweetFind;
mockSweet.findById = mockSweetFindById;
mockSweet.findByIdAndUpdate = mockSweetFindByIdAndUpdate;
mockSweet.findByIdAndDelete = mockSweetFindByIdAndDelete;

jest.unstable_mockModule('../../models/Sweet.js', () => ({
  default: mockSweet,
  Sweet: mockSweet
}));

// Import app after mocking
const { default: app } = await import('../../app.js');

describe('Sweet API Endpoints', () => {
  let adminToken;
  let customerToken;

  beforeAll(() => {
    // Generate test JWT tokens
    adminToken = jwt.sign(
      { 
        userId: 'admin123', 
        email: 'admin@example.com', 
        role: 'admin',
        name: 'Admin User'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    customerToken = jwt.sign(
      { 
        userId: 'customer123', 
        email: 'customer@example.com', 
        role: 'customer',
        name: 'Customer User'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  });

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('POST /api/sweets', () => {
    const validSweetData = {
      name: 'Chocolate Cake',
      price: 25.99,
      category: 'cake',
      quantity: 10
    };

    it('should create a new sweet with valid data and admin token', async () => {
      mockSweetSave.mockResolvedValue({
        _id: 'sweet123',
        ...validSweetData,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validSweetData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Sweet created successfully');
      expect(response.body.sweet.name).toBe(validSweetData.name);
      expect(response.body.sweet.price).toBe(validSweetData.price);
      expect(mockSweetSave).toHaveBeenCalledTimes(1);
    });

    it('should reject customer access (403 Forbidden)', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(validSweetData)
        .expect(403);

      expect(response.body.error).toBe('Access denied. admin role required');
      expect(mockSweetSave).not.toHaveBeenCalled();
    });

    it('should reject request without authentication', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .send(validSweetData)
        .expect(401);

      expect(response.body.error).toBe('Access token is required');
      expect(mockSweetSave).not.toHaveBeenCalled();
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', 'Bearer invalid-token')
        .send(validSweetData)
        .expect(401);

      expect(response.body.error).toBe('Invalid or expired token');
      expect(mockSweetSave).not.toHaveBeenCalled();
    });

    it('should return 400 for missing required fields', async () => {
      const invalidData = {
        name: 'Chocolate Cake',
        // missing price, category, quantity
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toContain('Validation failed');
      expect(mockSweetSave).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid price', async () => {
      const invalidData = {
        ...validSweetData,
        price: -10 // negative price
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toContain('Validation failed');
      expect(mockSweetSave).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid category', async () => {
      const invalidData = {
        ...validSweetData,
        category: 'invalid-category'
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toContain('Validation failed');
      expect(mockSweetSave).not.toHaveBeenCalled();
    });

    it('should return 400 for negative quantity', async () => {
      const invalidData = {
        ...validSweetData,
        quantity: -5
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toContain('Validation failed');
      expect(mockSweetSave).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      // Create a custom implementation that throws a non-validation error
      const originalImplementation = mockSweet.getMockImplementation();
      
      mockSweet.mockImplementationOnce((data) => ({
        ...data,
        _id: 'sweet123',
        save: jest.fn().mockRejectedValue(new Error('Database connection failed'))
      }));

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validSweetData)
        .expect(500);

      expect(response.body.error).toBe('Internal server error');
      
      // Restore original implementation
      mockSweet.mockImplementation(originalImplementation);
    });

    it('should return 200 for GET requests (endpoint now exists)', async () => {
      mockSweetFind.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('No sweets found');
    });
  });

  describe('GET /api/sweets', () => {
    it('should return all sweets for authenticated user', async () => {
      const mockSweets = [
        {
          _id: 'sweet1',
          name: 'Chocolate Cake',
          price: 25.99,
          category: 'cake',
          quantity: 10,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: 'sweet2',
          name: 'Vanilla Cookies',
          price: 12.50,
          category: 'cookie',
          quantity: 25,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      mockSweetFind.mockResolvedValue(mockSweets);

      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.sweets).toHaveLength(2);
      expect(response.body.sweets[0].name).toBe('Chocolate Cake');
      expect(response.body.sweets[1].name).toBe('Vanilla Cookies');
      expect(mockSweetFind).toHaveBeenCalledTimes(1);
    });

    it('should return all sweets for admin user', async () => {
      const mockSweets = [
        {
          _id: 'sweet1',
          name: 'Chocolate Cake',
          price: 25.99,
          category: 'cake',
          quantity: 10,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      mockSweetFind.mockResolvedValue(mockSweets);

      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.sweets).toHaveLength(1);
      expect(mockSweetFind).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no sweets exist', async () => {
      mockSweetFind.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.sweets).toHaveLength(0);
      expect(response.body.message).toBe('No sweets found');
      expect(mockSweetFind).toHaveBeenCalledTimes(1);
    });

    it('should reject request without authentication', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .expect(401);

      expect(response.body.error).toBe('Access token is required');
      expect(mockSweetFind).not.toHaveBeenCalled();
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.error).toBe('Invalid or expired token');
      expect(mockSweetFind).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      mockSweetFind.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(500);

      expect(response.body.error).toBe('Internal server error');
      expect(mockSweetFind).toHaveBeenCalledTimes(1);
    });

    it('should support query parameters for filtering', async () => {
      const mockSweets = [
        {
          _id: 'sweet1',
          name: 'Chocolate Cake',
          price: 25.99,
          category: 'cake',
          quantity: 10,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      // Mock the chaining behavior: find().sort()
      const mockSortedQuery = {
        sort: jest.fn().mockResolvedValue(mockSweets)
      };
      mockSweetFind.mockReturnValue(mockSortedQuery);

      const response = await request(app)
        .get('/api/sweets?category=cake&sort=price')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.sweets).toHaveLength(1);
      expect(mockSweetFind).toHaveBeenCalledWith({ category: 'cake' });
      expect(mockSortedQuery.sort).toHaveBeenCalledWith({ price: 1 });
    });
  });

  describe('PUT /api/sweets/:id', () => {
    const validUpdateData = {
      name: 'Updated Chocolate Cake',
      price: 29.99,
      category: 'cake'
      // quantity should NOT be updatable via PUT - use restock/purchase endpoints instead
    };

    const mockUpdatedSweet = {
      _id: 'sweet123',
      ...validUpdateData,
      quantity: 10, // quantity remains unchanged from original
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    };

    it('should update a sweet with valid data and admin token', async () => {
      mockSweetFindByIdAndUpdate.mockResolvedValue(mockUpdatedSweet);

      const response = await request(app)
        .put('/api/sweets/sweet123')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validUpdateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Sweet updated successfully');
      expect(response.body.sweet.name).toBe(validUpdateData.name);
      expect(response.body.sweet.price).toBe(validUpdateData.price);
      expect(mockSweetFindByIdAndUpdate).toHaveBeenCalledWith(
        'sweet123',
        validUpdateData,
        { new: true, runValidators: true }
      );
    });

    it('should reject customer access (403 Forbidden)', async () => {
      const response = await request(app)
        .put('/api/sweets/sweet123')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(validUpdateData)
        .expect(403);

      expect(response.body.error).toBe('Access denied. admin role required');
      expect(mockSweetFindByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('should reject request without authentication', async () => {
      const response = await request(app)
        .put('/api/sweets/sweet123')
        .send(validUpdateData)
        .expect(401);

      expect(response.body.error).toBe('Access token is required');
      expect(mockSweetFindByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .put('/api/sweets/sweet123')
        .set('Authorization', 'Bearer invalid-token')
        .send(validUpdateData)
        .expect(401);

      expect(response.body.error).toBe('Invalid or expired token');
      expect(mockSweetFindByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('should return 404 when sweet not found', async () => {
      mockSweetFindByIdAndUpdate.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/sweets/nonexistent123')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validUpdateData)
        .expect(404);

      expect(response.body.error).toBe('Sweet not found');
      expect(mockSweetFindByIdAndUpdate).toHaveBeenCalledWith(
        'nonexistent123',
        validUpdateData,
        { new: true, runValidators: true }
      );
    });

    it('should return 400 for invalid price', async () => {
      const invalidData = {
        ...validUpdateData,
        price: -10
      };

      // Mock validation error from Mongoose
      const validationError = new Error('Validation failed: price: Price must be greater than 0');
      validationError.name = 'ValidationError';
      mockSweetFindByIdAndUpdate.mockRejectedValue(validationError);

      const response = await request(app)
        .put('/api/sweets/sweet123')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toContain('Validation failed');
      expect(mockSweetFindByIdAndUpdate).toHaveBeenCalled();
    });

    it('should return 400 for invalid category', async () => {
      const invalidData = {
        ...validUpdateData,
        category: 'invalid-category'
      };

      const validationError = new Error('Validation failed: category: Invalid category');
      validationError.name = 'ValidationError';
      mockSweetFindByIdAndUpdate.mockRejectedValue(validationError);

      const response = await request(app)
        .put('/api/sweets/sweet123')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toContain('Validation failed');
      expect(mockSweetFindByIdAndUpdate).toHaveBeenCalled();
    });

    it('should return 400 for negative quantity', async () => {
      const invalidData = {
        ...validUpdateData,
        quantity: -5 // This should be rejected since quantity shouldn't be updatable
      };

      const response = await request(app)
        .put('/api/sweets/sweet123')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBe('Quantity cannot be updated via PUT. Use restock/purchase endpoints.');
      expect(mockSweetFindByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('should reject any quantity updates', async () => {
      const invalidData = {
        ...validUpdateData,
        quantity: 20 // Even positive quantity should be rejected
      };

      const response = await request(app)
        .put('/api/sweets/sweet123')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBe('Quantity cannot be updated via PUT. Use restock/purchase endpoints.');
      expect(mockSweetFindByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('should allow partial updates (only price)', async () => {
      const partialUpdateData = { price: 35.99 };
      const partiallyUpdatedSweet = {
        ...mockUpdatedSweet,
        price: 35.99
      };

      mockSweetFindByIdAndUpdate.mockResolvedValue(partiallyUpdatedSweet);

      const response = await request(app)
        .put('/api/sweets/sweet123')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(partialUpdateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.sweet.price).toBe(35.99);
      expect(mockSweetFindByIdAndUpdate).toHaveBeenCalledWith(
        'sweet123',
        partialUpdateData,
        { new: true, runValidators: true }
      );
    });

    it('should handle database errors gracefully', async () => {
      mockSweetFindByIdAndUpdate.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .put('/api/sweets/sweet123')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validUpdateData)
        .expect(500);

      expect(response.body.error).toBe('Internal server error');
      expect(mockSweetFindByIdAndUpdate).toHaveBeenCalled();
    });

    it('should return 400 for invalid ObjectId format', async () => {
      const response = await request(app)
        .put('/api/sweets/invalid-id-format')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validUpdateData)
        .expect(400);

      expect(response.body.error).toBe('Invalid sweet ID format');
      expect(mockSweetFindByIdAndUpdate).not.toHaveBeenCalled();
    });
  });
});
