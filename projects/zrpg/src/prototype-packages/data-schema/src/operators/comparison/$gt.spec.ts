import { $gt } from './$gt';

describe('$gt()', () => {
  it('should return true when the value is greater than the number', () => {
    const value = 69;
    const operator = { $gt: 42 };

    const result = $gt({ value, operator });
    expect(result).toBe(true);
  });

  it('should return false when the value is less than the number', () => {
    const value = 69;
    const operator = { $gt: 100 };

    const result = $gt({ value, operator });
    expect(result).toBe(false);
  });

  it('should return false when the value is  equal to the number', () => {
    const value = 69;
    const operator = { $gt: 69 };

    const result = $gt({ value, operator });
    expect(result).toBe(false);
  });

  it('should return false when the value is not a number', () => {
    const value = '69';
    const operator = { $gt: 69 };

    const result = $gt({ value, operator });
    expect(result).toBe(false);
  });

  it('should return false when the value is an object and not a number', () => {
    const value = [69];
    const operator = { $gt: 69 };

    const result = $gt({ value, operator });
    expect(result).toBe(false);
  });

  it('should return false when the value is a deep object and not a number', () => {
    const value = { nestedNum: 69 };
    const operator = { $gt: 69 };

    const result = $gt({ value, operator });
    expect(result).toBe(false);
  });
});
