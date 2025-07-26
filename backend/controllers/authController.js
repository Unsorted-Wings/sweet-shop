import bcrypt from 'bcrypt';
import { connectToDatabase } from '../utils/db.js';
import { validateRegistrationData } from '../utils/validation.js';

/**
 * Auth Controller - Handles authentication business logic
 */
export class AuthController {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password  
   * @param {string} userData.name - User name
   * @returns {Promise<Object>} - Registration result
   */
  async registerUser(userData) {
    // Validate input data
    const validationError = validateRegistrationData(userData);
    if (validationError) {
      throw new ValidationError(validationError);
    }

    // Check if user already exists
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');
    const existingUser = await usersCollection.findOne({ email: userData.email });
    
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash the password
     const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const result = await usersCollection.insertOne({
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      role: userData.role || 'customer',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return {
      message: 'User registered successfully',
      userId: result.insertedId.toString()
    };
  }
}

/**
 * Custom error classes for better error handling
 */
export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

export class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 400;
  }
}
