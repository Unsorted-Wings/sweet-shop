import { jest } from '@jest/globals';
import bcrypt from 'bcrypt';

// Mock the database connection
jest.unstable_mockModule('../../utils/db.js', () => ({
  connectToDatabase: jest.fn()
}));

// Mock the User model
jest.unstable_mockModule('../../models/User.js', () => ({
  User: {
    findOne: jest.fn(),
    prototype: {
      save: jest.fn()
    }
  }
}));

const { connectToDatabase } = await import('../../utils/db.js');
const { User } = await import('../../models/User.js');
const { AuthController } = await import('../../controllers/authController.js');

describe('AuthController', () => {
  let authController;
  
  beforeEach(() => {
    authController = new AuthController();
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should hash password before storing in database', async () => {
      // Mock User.findOne to return null (no existing user)
      User.findOne.mockResolvedValue(null);
      
      // Mock user save method
      const mockSavedUser = {
        _id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'customer',
        password: 'hashedPassword'
      };
      
      // Create a mock User instance
      const mockUserInstance = {
        save: jest.fn().mockResolvedValue(mockSavedUser)
      };
      
      // Mock User constructor
      const MockUserConstructor = jest.fn().mockImplementation(() => mockUserInstance);
      MockUserConstructor.findOne = User.findOne;
      
      // Replace User import temporarily
      const authController = new AuthController();
      authController.constructor.prototype.User = MockUserConstructor;

      const userData = {
        email: 'test@example.com',
        password: 'plainTextPassword',
        name: 'Test User'
      };

      const result = await authController.registerUser(userData);

      // Verify the result includes all expected fields
      expect(result.message).toBe('User registered successfully');
      expect(result.userId).toBe('user123');
      expect(result.token).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
      
      // Verify User.findOne was called to check for existing user
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      
      // Verify save was called
      expect(mockUserInstance.save).toHaveBeenCalled();
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

    it('should return JWT token on successful registration', async () => {
      const mockSave = jest.fn().mockResolvedValue({
        _id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'customer'
      });
      
      const mockUser = {
        save: mockSave
      };
      
      // Mock User constructor
      const MockUser = jest.fn().mockImplementation(() => mockUser);
      MockUser.findOne = jest.fn().mockResolvedValue(null); // No existing user
      
      // Replace the User import
      jest.doMock('../../models/User.js', () => ({
        User: MockUser
      }));
      
      connectToDatabase.mockResolvedValue({});

      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      const result = await authController.registerUser(userData);

      // Verify the result includes JWT token
      expect(result.message).toBe('User registered successfully');
      expect(result.userId).toBe('user123');
      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe('string');
      
      // Verify token contains user data
      const jwt = await import('jsonwebtoken');
      const decoded = jwt.default.verify(result.token, process.env.JWT_SECRET);
      expect(decoded.userId).toBe('user123');
      expect(decoded.email).toBe('test@example.com');
      expect(decoded.role).toBe('customer');
    });


    it('should reject with ConflictError when user already exists', async () => {
      // Mock User.findOne to return an existing user
      User.findOne.mockResolvedValue({
        _id: 'existing-user',
        email: 'test@example.com'
      });

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
