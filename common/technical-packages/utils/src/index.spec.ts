import * as utils from './index';

import * as array from './array';
import * as math from './math';
import * as process from './process';
import * as timers from './timers';

describe('/index', () => {
  it('should re-export all the functions', () => {
    expect(utils).toEqual({
      ...array,
      ...math,
      ...process,
      ...timers,
    });
  });
});
