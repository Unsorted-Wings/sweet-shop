import { jest } from '@jest/globals';
import request from 'supertest';

// Set up test environment
process.env.JWT_SECRET = 'test-secret-key';

// Mock the database connection
jest.unstable_mockModule('../../utils/db.js', () => ({
  connectToDatabase: jest.fn().mockResolvedValue({})
}));

// Mock the User model
jest.unstable_mockModule('../../models/User.js', () => ({
  User: class MockUser {
    constructor(userData) {
      this.userData = userData;
      this._id = 'test-user-id';
      this.email = userData.email;
      this.name = userData.name;
      this.role = userData.role || 'customer';
      this.password = userData.password;
    }
    
    async save() {
      return {
        _id: this._id,
        email: this.email,
        name: this.name,
        role: this.role,
        password: this.password
      };
    }
    
    static async findOne(query) {
      return null; // Default to no existing user
    }
  }
}));

const { connectToDatabase } = await import('../../utils/db.js');
const { User } = await import('../../models/User.js');

describe('JWT Authentication Middleware', () => {
  let app;
  
  beforeAll(async () => {
    const { createApp } = await import('../../app.js');
    app = createApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticateToken middleware', () => {
    it('should allow access with valid JWT token', async () => {
      // Generate a valid JWT token
      const jwt = await import('jsonwebtoken');
      const validToken = jwt.default.sign(
        { 
          userId: 'user123', 
          email: 'test@example.com', 
          role: 'customer' 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      const response = await request(app)
        .get('/api/protected/test')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.message).toBe('Access granted');
      expect(response.body.user.userId).toBe('user123');
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user.role).toBe('customer');
    });
  })
    
});
