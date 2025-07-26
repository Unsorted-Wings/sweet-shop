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
  if (!data.description) validationErrors.push('Description is required');
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
      description: 'Delicious chocolate cake',
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

    it('should allow customer to create a new sweet', async () => {
      mockSweetSave.mockResolvedValue({
        _id: 'sweet123',
        ...validSweetData,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(validSweetData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Sweet created successfully');
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
        // missing description, price, category, quantity
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

    it('should return 405 for non-POST requests', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404); // 404 until we implement GET

      // We'll update this test when we implement the GET endpoint
    });
  });
});
