import * as threadListIndex from './index';

import { threadList } from './threadList';

describe('/index', () => {
  it('should re-export everything', () => {
    expect(threadListIndex).toEqual({ threadList });
  });
});
