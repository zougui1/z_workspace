import { toFunction } from './toFunction';

describe('toFunction()', () => {
  it('should return a function returning the value', () => {
    const value = 69;
    const result = toFunction(value);

    expect(result()).toBe(value);
  });

  it('should return the function', () => {
    const value = () => {};
    const result = toFunction(value);

    expect(result).toBe(value);
  });
});
