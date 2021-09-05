import * as utils from './index';

import { Exception } from './Exception';

describe('/index', () => {
  it('should re-export everything', () => {
    expect(utils).toEqual({ Exception });
  });
});
