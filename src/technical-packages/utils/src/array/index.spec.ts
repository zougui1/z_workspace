import * as array from './index';

describe('array/index', () => {
  it('should re-export all the array functions', () => {
    expect(array).toHaveProperty('toArray');
    expect(array.toArray).toBeFunction();
  });
});
