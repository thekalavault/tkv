module.exports = {
  ...require('./jest.config'),
  testMatch: ['**/tests/e2e/**/*.test.ts'],
  testTimeout: 30000,
};
