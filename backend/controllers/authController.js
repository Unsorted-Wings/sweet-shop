import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../utils/db.js';
import { User } from '../models/User.js';
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

    // Connect to the database
    await connectToDatabase();
    const existingUser = await User.findOne({ email: userData.email });

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash the password
     const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const newUser = new User({
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      role: userData.role || 'customer'
    });

    const savedUser = await newUser.save();
    
    // Generate JWT token
    const token = this.generateJWTToken({
      userId: savedUser._id.toString(),
      email: savedUser.email,
      name: savedUser.name,
      role: savedUser.role
    });
    
    return {
      message: 'User registered successfully',
      userId: savedUser._id.toString(),
      token: token,
      user: {
        id: savedUser._id.toString(),
        email: savedUser.email,
        name: savedUser.name,
        role: savedUser.role
      }
    };
  }

  async loginUser(loginData) {
    // Connect to the database
    await connectToDatabase();
    // Validate input data
    if (!loginData.email) {
      throw new ValidationError('Email is required');
    }
    if (!loginData.password) {
      throw new ValidationError('Password is required');
    }
    
    // Find user by email
    const user = await User.findOne({ email: loginData.email });
    
    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }
    
    // Generate JWT token
    const token = this.generateJWTToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role
    });
    
    return {
      message: 'Login successful',
      token: token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  }

  /**
   * Generate JWT token for user
   * @param {Object} payload - Token payload
   * @returns {string} - JWT token
   */
  generateJWTToken(payload) {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '24h' // Token expires in 24 hours
    });
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

export class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = 401;
  }
}
