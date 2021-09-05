import { coverageConfig } from './coverageConfig';
import { getCoverageSources } from './getCoverageSources';
import { getCoverageDir } from './getCoverageDir';

export const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  coverageDirectory: getCoverageDir(),
  collectCoverageFrom: getCoverageSources(),
  setupFilesAfterEnv: ['jest-extended', 'jest-date-mock'],
  coverageThreshold: coverageConfig,
  testTimeout: 10000,
}
