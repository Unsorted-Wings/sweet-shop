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
});
