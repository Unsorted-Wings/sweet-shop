import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../../app.js';
import jwt from 'jsonwebtoken';

// Mock the database connection
jest.unstable_mockModule('../../utils/db.js', () => ({
  default: jest.fn().mockResolvedValue(true)
}));

// Mock the Sweet model
const mockSweetSave = jest.fn();
const mockSweetFind = jest.fn();
const mockSweetFindById = jest.fn();
const mockSweetFindByIdAndUpdate = jest.fn();
const mockSweetFindByIdAndDelete = jest.fn();

jest.unstable_mockModule('../../models/Sweet.js', () => ({
  default: jest.fn().mockImplementation((data) => ({
    ...data,
    _id: 'sweet123',
    save: mockSweetSave
  })),
  find: mockSweetFind,
  findById: mockSweetFindById,
  findByIdAndUpdate: mockSweetFindByIdAndUpdate,
  findByIdAndDelete: mockSweetFindByIdAndDelete
}));

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

      expect(response.body.error).toContain('validation');
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

      expect(response.body.error).toContain('validation');
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

      expect(response.body.error).toContain('validation');
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

      expect(response.body.error).toContain('validation');
      expect(mockSweetSave).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      mockSweetSave.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validSweetData)
        .expect(500);

      expect(response.body.error).toBe('Internal server error');
      expect(mockSweetSave).toHaveBeenCalledTimes(1);
    });

    it('should return 405 for non-POST requests', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200); // This will be 404 initially until we implement GET

      // We'll update this test when we implement the GET endpoint
    });
  });
});
