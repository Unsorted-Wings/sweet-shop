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
});
