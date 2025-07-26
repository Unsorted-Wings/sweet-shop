export default {
  testEnvironment: 'node',
  
  // ES modules support
  preset: null,
  testMatch: ['**/tests/**/*.test.js'],
  transform: {},
  moduleFileExtensions: ['js', 'json', 'node'],
  
  // Setup files
  setupFilesAfterEnv: [],
  
  // Coverage configuration
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/'
  ],
  
  // Verbose output
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Test timeout
  testTimeout: 10000
};