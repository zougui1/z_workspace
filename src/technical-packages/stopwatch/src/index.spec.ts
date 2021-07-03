import * as stopwatch from './index';

import { Stopwatch } from './Stopwatch';

describe('/index', () => {
  it('should re-export everything', () => {
    expect(stopwatch).toEqual({ Stopwatch });
  });
});
