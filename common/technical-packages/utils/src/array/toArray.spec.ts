import { toArray } from './toArray';

describe('toArray()', () => {
  it('should return the value into an array when it is not an array', () => {
    const value = 'my val';
    const result = toArray(value);
    expect(result).toEqual([value]);
  });

  it('should return the value as is when it is an array', () => {
    const value = 'my val';
    const result = toArray([value]);
    expect(result).toEqual([value]);
  });
});
