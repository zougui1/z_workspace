import { $lte } from './$lte';

describe('$lte()', () => {
  it('should return false when the value is greater than the number', () => {
    const value = 69;
    const operator = { $lte: 42 };

    const result = $lte({ value, operator });
    expect(result).toBe(false);
  });

  it('should return true when the value is less than the number', () => {
    const value = 69;
    const operator = { $lte: 100 };

    const result = $lte({ value, operator });
    expect(result).toBe(true);
  });

  it('should return true when the value is equal to the number', () => {
    const value = 69;
    const operator = { $lte: 69 };

    const result = $lte({ value, operator });
    expect(result).toBe(true);
  });

  it('should return false when the value is not a number', () => {
    const value = '69';
    const operator = { $lte: 69 };

    const result = $lte({ value, operator });
    expect(result).toBe(false);
  });

  it('should return false when the value is an object and not a number', () => {
    const value = [69];
    const operator = { $lte: 69 };

    const result = $lte({ value, operator });
    expect(result).toBe(false);
  });

  it('should return false when the value is a deep object and not a number', () => {
    const value = { nestedNum: 69 };
    const operator = { $lte: 69 };

    const result = $lte({ value, operator });
    expect(result).toBe(false);
  });
});
