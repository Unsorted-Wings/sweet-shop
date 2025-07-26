import dotenv from 'dotenv';
import { AuthController } from './controllers/authController.js';

// Load environment variables
dotenv.config();

async function testRegistration() {
  console.log('Testing real MongoDB registration...');
  
  const authController = new AuthController();
  
  try {
    // Test user data
    const testUser = {
      email: `test.user.${Date.now()}@example.com`, // Unique email
      password: 'testPassword123',
      name: 'Test User'
    };
    
    console.log('Attempting to register user:', {
      email: testUser.email,
      name: testUser.name,
      password: '[HIDDEN]'
    });
    
    // Register the user
    const result = await authController.registerUser(testUser);
    
    console.log('Registration successful!');
    console.log('Result:', {
      message: result.message,
      userId: result.userId,
      token: result.token ? `${result.token.substring(0, 20)}...` : 'No token',
      user: result.user
    });
    
    // Try to register the same user again (should fail)
    console.log('\n Testing duplicate user registration...');
    try {
      await authController.registerUser(testUser);
      console.log('ERROR: Duplicate registration should have failed!');
    } catch (duplicateError) {
      console.log('Duplicate user correctly rejected:', duplicateError.message);
    }
    
  } catch (error) {
    console.error('Registration failed:', error.message);
    console.error('Full error:', error);
  }
  
  console.log('\nTest completed!');
  process.exit(0);
}

// Run the test
testRegistration();