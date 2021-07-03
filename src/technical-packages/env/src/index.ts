import * as envVar from './envVar';
import * as configEnv from './configEnv';
import * as constants from './constants';
import * as baseEnv from './baseEnv';

export * from './envVar';
export * from './configEnv';
export * from './constants';
export * from './baseEnv';
export default {
  ...envVar,
  ...configEnv,
  ...constants,
  ...baseEnv,
};
