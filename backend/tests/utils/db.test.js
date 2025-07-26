import { jest } from '@jest/globals';

const mockConnection = { connection: 'mocked' };

const mockConnect = jest.fn(() => Promise.resolve(mockConnection));

jest.unstable_mockModule('mongoose', () => ({
  default: {
    connect: mockConnect,
  },
}));

const { connectToDatabase } = await import('../../utils/db.js');

process.env.MONGODB_URI = 'mongodb://localhost:27017/test';

describe('connectToDatabase utility', () => {
  beforeEach(() => {
    if (global.mongoose) {
      global.mongoose.conn = null;
      global.mongoose.promise = null;
    } else {
      global.mongoose = { conn: null, promise: null };
    }
  });

  it('should establish a connection on first call', async () => {
    mockConnect.mockClear();
    const conn = await connectToDatabase();
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockConnect).toHaveBeenCalledWith(
      'mongodb://localhost:27017/test',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    expect(conn).toBe(mockConnection);
  });

  it('should use cached connection if available', async () => {
    mockConnect.mockClear();
    
    const conn1 = await connectToDatabase();
    expect(mockConnect).toHaveBeenCalledTimes(1);
    
    const conn2 = await connectToDatabase();
    
    
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(conn2).toBe(mockConnection);
    expect(conn1).toBe(conn2);
  });

  it('should throw an error when MONGODB_URI is not set', async () => {
    mockConnect.mockClear();
    const originalUri = process.env.MONGODB_URI;
    delete process.env.MONGODB_URI;
    
    await expect(connectToDatabase()).rejects.toThrow(
      'MONGODB_URI environment variable is not set'
    );
    
    // Restore the environment variable for other tests
    process.env.MONGODB_URI = originalUri;
  });

  it('should throw an error when mongoose.connect fails', async () => {
    mockConnect.mockClear();
    const connectionError = new Error('Connection failed');
    mockConnect.mockRejectedValueOnce(connectionError);

    await expect(connectToDatabase()).rejects.toThrow('Connection failed');
  });

  it('should handle concurrent connection attempts correctly', async () => {
    mockConnect.mockClear();
    
    const promise1 = connectToDatabase();
    const promise2 = connectToDatabase();
    const promise3 = connectToDatabase();
    
    const [conn1, conn2, conn3] = await Promise.all([promise1, promise2, promise3]);
    
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(conn1).toBe(conn2);
    expect(conn2).toBe(conn3);
  });

  it('should allow retry after connection failure', async () => {
    mockConnect.mockClear();
    
    const connectionError = new Error('Network timeout');
    mockConnect.mockRejectedValueOnce(connectionError);
    
    await expect(connectToDatabase()).rejects.toThrow('Network timeout');
    
    mockConnect.mockResolvedValueOnce(mockConnection);
    const conn = await connectToDatabase();
    
    expect(conn).toBe(mockConnection);
    expect(mockConnect).toHaveBeenCalledTimes(2);
  });
});
