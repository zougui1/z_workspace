import { currentScope, getScope, Package } from './scope';
import { config } from './configEnv';

import * as envVar from './envVar';
import * as configEnv from './configEnv';
import * as constants from './constants';
import * as baseEnv from './baseEnv';

export {
  config,
};

export default {
  ...envVar,
  ...configEnv,
  ...constants,
  ...baseEnv,
  get SCOPE(): Package {
    return currentScope({ limit: 3, offset: 2 });
  },
  getScope,
};
