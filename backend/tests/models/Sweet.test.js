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
      expect(sweet).toBeInstanceOf(Sweet);
    });

    it('should have an id field', () => {
      const sweetData = {
        name: 'Chocolate Bar',
        category: 'chocolate',
        price: 2.50,
        quantity: 100
      };

      const sweet = new Sweet(sweetData);
      expect(sweet.id).toBeDefined();
      expect(typeof sweet.id).toBe('string');
    });

    it('should validate required fields', async () => {
      const sweet = new Sweet({});
      
      try {
        await sweet.validate();
        fail('Should have thrown validation error');
      } catch (error) {
        expect(error.errors.name).toBeDefined();
        expect(error.errors.category).toBeDefined();
        expect(error.errors.price).toBeDefined();
        expect(error.errors.quantity).toBeDefined();
      }
    });

    it('should validate price is positive', async () => {
      const testCases = [
        { price: -1.50, description: 'negative price' },
        { price: 0, description: 'zero price' },
        { price: 'invalid', description: 'non-numeric price' }
      ];

      for (const testCase of testCases) {
        const sweetData = {
          name: 'Test Sweet',
          category: 'candy',
          price: testCase.price,
          quantity: 10
        };

        const sweet = new Sweet(sweetData);
        
        try {
          await sweet.validate();
          fail(`Should have thrown validation error for ${testCase.description}`);
        } catch (error) {
          expect(error.errors.price).toBeDefined();
        }
      }
    });
  });
});
