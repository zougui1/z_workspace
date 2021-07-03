import { clamp } from './clamp';

describe('clamp()', () => {
  it('should return the minimum if value is less than the minimum', () => {
    const value = 0;
    const min = 5;
    const max = 15;
    const result = clamp(value, min ,max);
    expect(result).toEqual(min);
  });

  it('should return the maximum if value is greater than the maximum', () => {
    const value = 50;
    const min = 5;
    const max = 15;
    const result = clamp(value, min ,max);
    expect(result).toEqual(max);
  });

  it('should return the value if it is between the minimum and maximum', () => {
    const value = 10;
    const min = 5;
    const max = 15;
    const result = clamp(value, min ,max);
    expect(result).toEqual(value);
  });
});
