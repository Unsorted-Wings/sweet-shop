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
});
