import { Sweet } from '../../models/Sweet.js';

describe('Sweet Model', () => {
  describe('schema validation', () => {
    it('should create a sweet with valid data', () => {
      const sweetData = {
        name: 'Chocolate Bar',
        category: 'chocolate',
        price: 2.50,
        quantity: 100
      };

      const sweet = new Sweet(sweetData);

      expect(sweet.name).toBe('Chocolate Bar');
      expect(sweet.category).toBe('chocolate');
      expect(sweet.price).toBe(2.50);
      expect(sweet.quantity).toBe(100);
      expect(sweet.createdAt).toBeInstanceOf(Date);
      expect(sweet.updatedAt).toBeInstanceOf(Date);
      expect(sweet).toBeInstanceOf(Sweet);
    });
  });
});
