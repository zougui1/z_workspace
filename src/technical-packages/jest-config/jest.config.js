const path = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  coverageDirectory: path.join(__dirname, 'coverage'),
  collectCoverageFrom: [
    '!**/types/**/*.ts',
    '!**/*.mock.ts',
    '!**/node_modules/**',
    '!**/experiments/**',
  ],
  setupFilesAfterEnv: ['jest-extended', 'jest-date-mock'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  testTimeout: 10000,
};
