import { jest } from '@jest/globals';
import request from 'supertest';

// We'll need to mock the database connection
jest.unstable_mockModule('../../utils/db.js', () => ({
  connectToDatabase: jest.fn(() => Promise.resolve({
    collection: jest.fn(() => ({
      findOne: jest.fn(),
      insertOne: jest.fn(),
    }))
  }))
}));

const { connectToDatabase } = await import('../../utils/db.js');

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
    // Setup mock to return no existing user
    const mockDb = {
      collection: jest.fn(() => ({
        findOne: jest.fn().mockResolvedValue(null), // No existing user
        insertOne: jest.fn().mockResolvedValue({
          insertedId: 'user123'
        })
      }))
    };
    
    connectToDatabase.mockResolvedValue(mockDb);

    const newUser = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(newUser)
      .expect(201);

    expect(response.body).toEqual({
      message: 'User registered successfully',
      userId: 'user123'
    });
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
    // Setup mock for this specific test
    const mockDb = {
      collection: jest.fn(() => ({
        findOne: jest.fn().mockResolvedValue({
          _id: 'existing-user-id',
          email: 'existing@example.com',
          name: 'Existing User'
        })
      }))
    };
    
    connectToDatabase.mockResolvedValue(mockDb);

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

    // Verify database was queried for existing user
    expect(connectToDatabase).toHaveBeenCalled();
    expect(mockDb.collection).toHaveBeenCalledWith('users');
  });
});
