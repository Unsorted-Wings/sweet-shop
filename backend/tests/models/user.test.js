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
});