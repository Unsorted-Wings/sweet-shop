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

    it('should reject request without Authorization header', async () => {
      const response = await request(app)
        .get('/api/protected/test')
        .expect(401);

      expect(response.body).toEqual({
        error: 'Access token is required'
      });
    });

    it('should reject request with malformed Authorization header', async () => {
      const response = await request(app)
        .get('/api/protected/test')
        .set('Authorization', 'InvalidFormat token123')
        .expect(401);

      expect(response.body).toEqual({
        error: 'Invalid token format. Use Bearer <token>'
      });
    });

    it('should reject request with invalid JWT token', async () => {
      const response = await request(app)
        .get('/api/protected/test')
        .set('Authorization', 'Bearer invalid-token-here')
        .expect(401);

      expect(response.body).toEqual({
        error: 'Invalid or expired token'
      });
    });

    it('should reject request with expired JWT token', async () => {
      // Generate an expired JWT token
      const jwt = await import('jsonwebtoken');
      const expiredToken = jwt.default.sign(
        { 
          userId: 'user123', 
          email: 'test@example.com', 
          role: 'customer' 
        },
        process.env.JWT_SECRET,
        { expiresIn: '-1h' } // Expired 1 hour ago
      );

      const response = await request(app)
        .get('/api/protected/test')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body).toEqual({
        error: 'Invalid or expired token'
      });
    });

    it('should reject request with token signed with wrong secret', async () => {
      // Generate a JWT token with wrong secret
      const jwt = await import('jsonwebtoken');
      const wrongSecretToken = jwt.default.sign(
        { 
          userId: 'user123', 
          email: 'test@example.com', 
          role: 'customer' 
        },
        'wrong-secret',
        { expiresIn: '24h' }
      );

      const response = await request(app)
        .get('/api/protected/test')
        .set('Authorization', `Bearer ${wrongSecretToken}`)
        .expect(401);

      expect(response.body).toEqual({
        error: 'Invalid or expired token'
      });
    });

    it('should extract user information and add to request object', async () => {
      // Generate a valid JWT token
      const jwt = await import('jsonwebtoken');
      const validToken = jwt.default.sign(
        { 
          userId: 'user456', 
          email: 'admin@example.com', 
          role: 'admin',
          name: 'Admin User'
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      const response = await request(app)
        .get('/api/protected/test')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.user.userId).toBe('user456');
      expect(response.body.user.email).toBe('admin@example.com');
      expect(response.body.user.role).toBe('admin');
      expect(response.body.user.name).toBe('Admin User');
    });

    it('should handle Authorization header case insensitivity', async () => {
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
        .set('authorization', `Bearer ${validToken}`) // lowercase header
        .expect(200);

      expect(response.body.message).toBe('Access granted');
    });

    it('should reject empty Bearer token', async () => {
      const response = await request(app)
        .get('/api/protected/test')
        .set('Authorization', 'Bearer ')
        .expect(401);

      expect(response.body).toEqual({
        error: 'Invalid token format. Use Bearer <token>'
      });
    });

    it('should reject Authorization header with only Bearer', async () => {
      const response = await request(app)
        .get('/api/protected/test')
        .set('Authorization', 'Bearer')
        .expect(401);

      expect(response.body).toEqual({
        error: 'Invalid token format. Use Bearer <token>'
      });
    });
  });

  describe('role-based access control', () => {
    it('should allow admin access to admin-only endpoints', async () => {
      // Generate a valid admin JWT token
      const jwt = await import('jsonwebtoken');
      const adminToken = jwt.default.sign(
        { 
          userId: 'admin123', 
          email: 'admin@example.com', 
          role: 'admin',
          name: 'Admin User'
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      const response = await request(app)
        .get('/api/admin/test')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.message).toBe('Admin access granted');
      expect(response.body.user.role).toBe('admin');
    });

    it('should deny customer access to admin-only endpoints', async () => {
      // Generate a valid customer JWT token
      const jwt = await import('jsonwebtoken');
      const customerToken = jwt.default.sign(
        { 
          userId: 'customer123', 
          email: 'customer@example.com', 
          role: 'customer',
          name: 'Customer User'
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      const response = await request(app)
        .get('/api/admin/test')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(403);

      expect(response.body).toEqual({
        error: 'Access denied. admin role required'
      });
    });

    it('should deny access to admin endpoints without authentication', async () => {
      const response = await request(app)
        .get('/api/admin/test')
        .expect(401);

      expect(response.body).toEqual({
        error: 'Access token is required'
      });
    });

    it('should deny access with invalid token to admin endpoints', async () => {
      const response = await request(app)
        .get('/api/admin/test')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toEqual({
        error: 'Invalid or expired token'
      });
    });
  });

  describe('token payload validation', () => {
    it('should handle token without userId', async () => {
      // Generate a JWT token without userId
      const jwt = await import('jsonwebtoken');
      const incompleteToken = jwt.default.sign(
        { 
          email: 'test@example.com', 
          role: 'customer' 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      const response = await request(app)
        .get('/api/protected/test')
        .set('Authorization', `Bearer ${incompleteToken}`)
        .expect(200);

      expect(response.body.user.userId).toBeUndefined();
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should handle token without role', async () => {
      // Generate a JWT token without role
      const jwt = await import('jsonwebtoken');
      const incompleteToken = jwt.default.sign(
        { 
          userId: 'user123',
          email: 'test@example.com'
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      const response = await request(app)
        .get('/api/protected/test')
        .set('Authorization', `Bearer ${incompleteToken}`)
        .expect(200);

      expect(response.body.user.role).toBeUndefined();
      expect(response.body.user.userId).toBe('user123');
    });

    it('should handle minimal token payload', async () => {
      // Generate a JWT token with minimal payload
      const jwt = await import('jsonwebtoken');
      const minimalToken = jwt.default.sign(
        {},
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      const response = await request(app)
        .get('/api/protected/test')
        .set('Authorization', `Bearer ${minimalToken}`)
        .expect(200);

      expect(response.body.user.userId).toBeUndefined();
      expect(response.body.user.email).toBeUndefined();
      expect(response.body.user.role).toBeUndefined();
    });
  });

  describe('JWT_SECRET environment variable', () => {
    it('should handle missing JWT_SECRET gracefully', async () => {
      // Temporarily remove JWT_SECRET
      const originalSecret = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;

      const response = await request(app)
        .get('/api/protected/test')
        .set('Authorization', 'Bearer some-token')
        .expect(401);

      expect(response.body).toEqual({
        error: 'Invalid or expired token'
      });

      // Restore JWT_SECRET
      process.env.JWT_SECRET = originalSecret;
    });
  });
});
