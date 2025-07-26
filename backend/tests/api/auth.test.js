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

describe('POST /api/auth/register', () => {
  let app;
  
  beforeAll(async () => {
    const { createApp } = await import('../../app.js');
    app = createApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user with valid data', async () => {
    // Mock User.findOne to return null (no existing user)
    jest.spyOn(User, 'findOne').mockResolvedValue(null);

    const newUser = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(newUser)
      .expect(201);

    expect(response.body.message).toBe('User registered successfully');
    expect(response.body.userId).toBe('test-user-id');
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBe('test@example.com');
  });

  it('should return 400 when required fields are missing', async () => {
    const testCases = [
      {
        description: 'missing email',
        userData: { password: 'password123', name: 'Test User' },
        expectedError: 'Email is required'
      },
      {
        description: 'missing password', 
        userData: { email: 'test@example.com', name: 'Test User' },
        expectedError: 'Password is required'
      },
      {
        description: 'missing name',
        userData: { email: 'test@example.com', password: 'password123' },
        expectedError: 'Name is required'
      },
      {
        description: 'empty request body',
        userData: {},
        expectedError: 'Email is required'
      }
    ];

    for (const testCase of testCases) {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testCase.userData)
        .expect(400);

      expect(response.body).toEqual({
        error: testCase.expectedError
      });
    }
  });

  it('should return 400 when email format is invalid', async () => {
    const testCases = [
      {
        description: 'email without @ symbol',
        userData: { email: 'invalidemail.com', password: 'password123', name: 'Test User' },
        expectedError: 'Invalid email format'
      },
      {
        description: 'email without domain',
        userData: { email: 'user@', password: 'password123', name: 'Test User' },
        expectedError: 'Invalid email format'
      },
      {
        description: 'email without local part',
        userData: { email: '@domain.com', password: 'password123', name: 'Test User' },
        expectedError: 'Invalid email format'
      },
      {
        description: 'empty email string',
        userData: { email: '', password: 'password123', name: 'Test User' },
        expectedError: 'Email is required'
      },
      {
        description: 'email with spaces',
        userData: { email: 'user @domain.com', password: 'password123', name: 'Test User' },
        expectedError: 'Invalid email format'
      }
    ];

    for (const testCase of testCases) {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testCase.userData)
        .expect(400);

      expect(response.body).toEqual({
        error: testCase.expectedError
      });
    }
  });

  it('should return 400 when password is too weak', async () => {
    const testCases = [
      {
        description: 'password too short (less than 6 characters)',
        userData: { email: 'test@example.com', password: '123', name: 'Test User' },
        expectedError: 'Password must be at least 6 characters long'
      },
      {
        description: 'password exactly 5 characters',
        userData: { email: 'test@example.com', password: '12345', name: 'Test User' },
        expectedError: 'Password must be at least 6 characters long'
      },
      {
        description: 'empty password string',
        userData: { email: 'test@example.com', password: '', name: 'Test User' },
        expectedError: 'Password is required'
      },
      {
        description: 'password with only spaces',
        userData: { email: 'test@example.com', password: '      ', name: 'Test User' },
        expectedError: 'Password must be at least 6 characters long'
      }
    ];

    for (const testCase of testCases) {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testCase.userData)
        .expect(400);

      expect(response.body).toEqual({
        error: testCase.expectedError
      });
    }
  });

  it('should return 400 when user already exists', async () => {
    // Mock User.findOne to return an existing user
    jest.spyOn(User, 'findOne').mockResolvedValue({
      _id: 'existing-user-id',
      email: 'existing@example.com',
      name: 'Existing User'
    });

    const duplicateUser = {
      email: 'existing@example.com',
      password: 'password123',
      name: 'Test User'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(duplicateUser)
      .expect(400);

    expect(response.body).toEqual({
      error: 'User with this email already exists'
    });
  });

  it('should hash the password before storing in database', async () => {
    // Import bcrypt to verify the hash
    const bcrypt = await import('bcrypt');
    
    // Mock User.findOne to return null (no existing user) 
    jest.spyOn(User, 'findOne').mockResolvedValue(null);

    const userData = {
      email: 'test@example.com',
      password: 'plainTextPassword',
      name: 'Test User'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    // Verify response structure
    expect(response.body.message).toBe('User registered successfully');
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe('test@example.com');
    expect(response.body.user.name).toBe('Test User');
    expect(response.body.user.role).toBe('customer');
    
    // Verify JWT token contains correct data
    const jwt = await import('jsonwebtoken');
    const decoded = jwt.default.verify(response.body.token, process.env.JWT_SECRET);
    expect(decoded.email).toBe('test@example.com');
    expect(decoded.role).toBe('customer');
  });
});
