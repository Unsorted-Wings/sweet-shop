import { jest } from '@jest/globals';

const mockConnect = jest.fn(() => Promise.resolve({ connection: 'mocked' }));
jest.mock('mongoose', () => ({
  default: {
    connect: mockConnect,
  },
  connect: mockConnect,
}));

const { connectToDatabase } = await import('../../utils/db.js');

process.env.MONGODB_URI = 'mongodb://localhost:27017/test';

describe('connectToDatabase utility', () => {
  beforeEach(() => {
    // Reset the global cache
    global.mongoose = { conn: null, promise: null };
    mockConnect.mockClear();
  });

  it('should establish a connection on first call', async () => {
    const conn = await connectToDatabase();
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockConnect).toHaveBeenCalledWith(
      'mongodb://localhost:27017/test',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    expect(conn).toEqual({ connection: 'mocked' });
  });

});
