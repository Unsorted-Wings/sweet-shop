import { jest } from '@jest/globals';
import bcrypt from 'bcrypt';

// Mock the database connection
jest.unstable_mockModule('../../utils/db.js', () => ({
  connectToDatabase: jest.fn()
}));

const { connectToDatabase } = await import('../../utils/db.js');
const { AuthController } = await import('../../controllers/authController.js');

describe('AuthController', () => {
  let authController;
  
  beforeEach(() => {
    authController = new AuthController();
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should hash password before storing in database', async () => {
      const mockInsertOne = jest.fn().mockResolvedValue({
        insertedId: 'user123'
      });
      
      const mockDb = {
        collection: jest.fn(() => ({
          findOne: jest.fn().mockResolvedValue(null), // No existing user
          insertOne: mockInsertOne
        }))
      };
      
      connectToDatabase.mockResolvedValue(mockDb);

      const userData = {
        email: 'test@example.com',
        password: 'plainTextPassword',
        name: 'Test User'
      };

      const result = await authController.registerUser(userData);

      // Verify the result
      expect(result.message).toBe('User registered successfully');
      expect(result.userId).toBe('user123');

      // Verify insertOne was called
      expect(mockInsertOne).toHaveBeenCalledTimes(1);
      
      // Get the data that was inserted
      const insertedData = mockInsertOne.mock.calls[0][0];
      
      // Verify password is not stored as plain text
      expect(insertedData.password).not.toBe('plainTextPassword');
      
      // Verify password is hashed (bcrypt hashes start with $2b$)
      expect(insertedData.password).toMatch(/^\$2b\$10\$/);
      
      // Verify the hash can be compared with original password
      const isValidHash = await bcrypt.compare('plainTextPassword', insertedData.password);
      expect(isValidHash).toBe(true);
      
      // Verify other fields are correct
      expect(insertedData.email).toBe('test@example.com');
      expect(insertedData.name).toBe('Test User');
      expect(insertedData.role).toBe('customer');
      expect(insertedData.createdAt).toBeInstanceOf(Date);
      expect(insertedData.updatedAt).toBeInstanceOf(Date);
    });

    it('should reject with ValidationError when password is too short', async () => {
      const userData = {
        email: 'test@example.com',
        password: '123', // Too short
        name: 'Test User'
      };

      await expect(authController.registerUser(userData))
        .rejects
        .toThrow('Password must be at least 6 characters long');
    });

    it('should reject with ConflictError when user already exists', async () => {
      const mockDb = {
        collection: jest.fn(() => ({
          findOne: jest.fn().mockResolvedValue({
            _id: 'existing-user',
            email: 'test@example.com'
          })
        }))
      };
      
      connectToDatabase.mockResolvedValue(mockDb);

      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      await expect(authController.registerUser(userData))
        .rejects
        .toThrow('User with this email already exists');
    });
  });
});
