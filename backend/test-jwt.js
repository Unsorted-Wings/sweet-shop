import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { AuthController } from './controllers/authController.js';

// Load environment variables
dotenv.config();

async function testJWT() {
  console.log('🔐 Testing JWT token generation and verification...');
  
  const authController = new AuthController();
  
  try {
    // Test user data
    const testUser = {
      email: `jwt.test.${Date.now()}@example.com`,
      password: 'testPassword123',
      name: 'JWT Test User'
    };
    
    // Register user and get JWT
    const result = await authController.registerUser(testUser);
    console.log('✅ User registered with JWT token');
    
    // Verify the JWT token
    const decoded = jwt.verify(result.token, process.env.JWT_SECRET);
    console.log('✅ JWT token verified successfully!');
    console.log('📋 Decoded token payload:', {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      expiresAt: new Date(decoded.exp * 1000).toLocaleString()
    });
    
    // Check if token payload matches user data
    if (decoded.userId === result.userId && 
        decoded.email === result.user.email && 
        decoded.name === result.user.name &&
        decoded.role === result.user.role) {
      console.log('✅ Token payload matches user data');
    } else {
      console.log('❌ Token payload mismatch!');
    }
    
  } catch (error) {
    console.error('❌ JWT test failed:', error.message);
  }
  
  console.log('\n🏁 JWT test completed!');
  process.exit(0);
}

testJWT();