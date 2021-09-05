import * as timers from './index';

describe('timers/index', () => {
  it('should re-export all the timers functions', () => {
    expect(timers).toHaveProperty('wait');
    expect(timers.wait).toBeFunction();

    expect(timers).toHaveProperty('waitSync');
    expect(timers.waitSync).toBeFunction();
  });
});
