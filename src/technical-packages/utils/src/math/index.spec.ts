import * as math from './index';

describe('math/index', () => {
  it('should re-export all the math functions', () => {
    expect(math).toHaveProperty('clamp');
    expect(math.clamp).toBeFunction();

    expect(math).toHaveProperty('parsePercentage');
    expect(math.parsePercentage).toBeFunction();

    expect(math).toHaveProperty('fromPercent');
    expect(math.fromPercent).toBeFunction();

    expect(math).toHaveProperty('applyPercentage');
    expect(math.applyPercentage).toBeFunction();
  });
});
