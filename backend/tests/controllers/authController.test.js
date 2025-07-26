import { jest } from '@jest/globals';
import bcrypt from 'bcrypt';

// Set up test environment
process.env.JWT_SECRET = 'test-secret-key';

// Mock the database connection
jest.unstable_mockModule('../../utils/db.js', () => ({
  connectToDatabase: jest.fn()
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
const { AuthController } = await import('../../controllers/authController.js');

describe('AuthController', () => {
  let authController;
  
  beforeEach(() => {
    authController = new AuthController();
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should hash password before storing in database', async () => {
      // Spy on bcrypt.hash to verify it's called
      const bcryptSpy = jest.spyOn(bcrypt, 'hash');
      
      // Mock User.findOne to return null (no existing user)
      jest.spyOn(User, 'findOne').mockResolvedValue(null);
      
      const userData = {
        email: 'test@example.com',
        password: 'plainTextPassword',
        name: 'Test User'
      };

      const result = await authController.registerUser(userData);

      // Verify bcrypt.hash was called with the plain password
      expect(bcryptSpy).toHaveBeenCalledWith('plainTextPassword', 10);
      
      // Verify result structure
      expect(result.message).toBe('User registered successfully');
      expect(result.token).toBeDefined();
      expect(result.userId).toBeDefined();
      
      // Clean up spy
      bcryptSpy.mockRestore();
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
      // Mock User.findOne to return null (no existing user)
      jest.spyOn(User, 'findOne').mockResolvedValue(null);

      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      const result = await authController.registerUser(userData);

      // Verify the result includes JWT token
      expect(result.message).toBe('User registered successfully');
      expect(result.userId).toBe('test-user-id');
      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe('string');
      
      // Verify token contains user data
      const jwt = await import('jsonwebtoken');
      const decoded = jwt.default.verify(result.token, process.env.JWT_SECRET);
      expect(decoded.userId).toBe('test-user-id');
      expect(decoded.email).toBe('test@example.com');
      expect(decoded.role).toBe('customer');
    });


    it('should reject with ConflictError when user already exists', async () => {
      // Mock User.findOne to return an existing user
      jest.spyOn(User, 'findOne').mockResolvedValue({
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

  describe('loginUser', () => {
    it('should authenticate user with valid credentials', async () => {
      // Mock User.findOne to return an existing user with hashed password
      const hashedPassword = await bcrypt.hash('password123', 10);
      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'customer',
        password: hashedPassword
      };
      
      jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);

      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const result = await authController.loginUser(loginData);

      // Verify the result includes JWT token and user data
      expect(result.message).toBe('Login successful');
      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe('string');
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.name).toBe('Test User');
      expect(result.user.role).toBe('customer');
      
      // Verify token contains user data
      const jwt = await import('jsonwebtoken');
      const decoded = jwt.default.verify(result.token, process.env.JWT_SECRET);
      expect(decoded.userId).toBe('user123');
      expect(decoded.email).toBe('test@example.com');
      expect(decoded.role).toBe('customer');
      
      // Verify User.findOne was called with correct email
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    });
  });
});
