import '@testing-library/jest-dom';

// Set environment variables for tests
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/kalavault_test';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.JWT_SECRET = 'test-secret-key-min-32-chars-long!';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-min-32-chars-long!';

// Mock logger in tests
jest.mock('../src/shared/logger/logger', () => ({
  logger: {
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

// Global test utilities
(global as any).testUtils = {
  generateToken: (payload: any) => {
    return 'test-token';
  },
  generateId: () => {
    return 'test-id';
  },
};
