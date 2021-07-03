const path = require('path');

const collectCoverageOptionIndex = process.argv.indexOf('--collectCoverage');
const targetCoveragePattern = process.argv[collectCoverageOptionIndex + 1];
const collectCoverageFrom = [];

if (collectCoverageOptionIndex !== -1 && targetCoveragePattern) {
  const targetCoverage = `**/${targetCoveragePattern}*`;
  collectCoverageFrom.push(targetCoverage);
} else {
  const globalCoverage = [
    '**/*.ts',
  ];
  collectCoverageFrom.push(...globalCoverage);
}

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  coverageDirectory: path.join(__dirname, 'coverage'),
  collectCoverageFrom: [
    ...collectCoverageFrom,
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
