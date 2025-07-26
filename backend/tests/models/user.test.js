import { User } from '../../models/User.js';

describe('User Model', () => {
  describe('schema validation', () => {
    it('should create a user document with valid data', () => {
      const userData = {
        email: 'test@example.com',
        password: 'hashedPassword123',
        name: 'Test User',
        role: 'customer'
      };

      const user = new User(userData);

      expect(user.email).toBe('test@example.com');
      expect(user.password).toBe('hashedPassword123');
      expect(user.name).toBe('Test User');
      expect(user.role).toBe('customer');
      expect(user).toBeInstanceOf(User);
    });
  });
    it('should set default role to customer if not provided', () => {
        const userData = {
            email: 'test@example.com',
            password: 'hashedPassword123',
            name: 'Test User'
        };

        const user = new User(userData);
        expect(user.role).toBe('customer');
    });

    it('should validate required fields', async () => {
        const user = new User({});
        
        try {
            await user.validate();
            fail('Should have thrown validation error');
        } catch (error) {
            expect(error.errors.email).toBeDefined();
            expect(error.errors.password).toBeDefined();
            expect(error.errors.name).toBeDefined();
        }
    });

    it('should reject invalid role values', async () => {
        const userData = {
            email: 'test@example.com',
            password: 'hashedPassword123',
            name: 'Test User',
            role: 'invalid-role'
        };

        const user = new User(userData);
        
        try {
            await user.validate();
            fail('Should have thrown validation error for invalid role');
        } catch (error) {
            expect(error.errors.role).toBeDefined();
            expect(error.errors.role.message).toContain('is not a valid enum value');
        }
    });

    it('should validate email format', async () => {
        const userData = {
            email: 'invalid-email-format',
            password: 'hashedPassword123',
            name: 'Test User'
        };

        const user = new User(userData);
        
        try {
            await user.validate();
            fail('Should have thrown validation error for invalid email');
        } catch (error) {
            expect(error.errors.email).toBeDefined();
            expect(error.errors.email.message).toContain('Invalid email format');
        }
    });

    it('should validate password length', async () => {
        const testCases = [
            { password: '123', description: 'too short', expectedMessage: 'Password must be at least 6 characters long' },
            { password: '12345', description: 'exactly 5 chars', expectedMessage: 'Password must be at least 6 characters long' },
            { password: '     ', description: 'only spaces', expectedMessage: 'Password must be at least 6 characters long' }
        ];

        for (const testCase of testCases) {
            const userData = {
                email: 'test@example.com',
                password: testCase.password,
                name: 'Test User'
            };

            const user = new User(userData);
            
            try {
                await user.validate();
                fail(`Should have thrown validation error for password: ${testCase.description}`);
            } catch (error) {
                expect(error.errors.password).toBeDefined();
                expect(error.errors.password.message).toContain(testCase.expectedMessage);
            }
        }
    });

    it('should validate name field', async () => {
        const testCases = [
            { name: '', description: 'empty string' },
            { name: '   ', description: 'only spaces' }
        ];

        for (const testCase of testCases) {
            const userData = {
                email: 'test@example.com',
                password: 'hashedPassword123',
                name: testCase.name
            };

            const user = new User(userData);
            
            try {
                await user.validate();
                fail(`Should have thrown validation error for name: ${testCase.description}`);
            } catch (error) {
                expect(error.errors.name).toBeDefined();
            }
        }
    });

     it('should accept valid password lengths', async () => {
        const validPasswords = [
            'password123',    // exactly 6 chars
            'verylongpassword', // longer password
            'pass123!@#'      // with special chars
        ];

        for (const password of validPasswords) {
            const userData = {
                email: 'test@example.com',
                password: password,
                name: 'Test User'
            };

            const user = new User(userData);
            await expect(user.validate()).resolves.not.toThrow();
        }
    });

    it('should handle email case sensitivity', () => {
        const userData = {
            email: 'TEST@EXAMPLE.COM',
            password: 'hashedPassword123',
            name: 'Test User'
        };

        const user = new User(userData);
        expect(user.email).toBe('TEST@EXAMPLE.COM'); // Should preserve case
    });
});