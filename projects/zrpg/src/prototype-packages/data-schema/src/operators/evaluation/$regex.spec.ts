import { $regex } from './$regex';

describe('$regex()', () => {
  it('should return true when the regex "/[a-z]/" matches the value', () => {
    const value = '545a54';
    const operator = { $regex: '/[a-z]/' };
    const doMatch = $regex({ value, operator });

    expect(doMatch).toBe(true);
  });

  it('should return false when the regex "/[a-z]/" does not match the value', () => {
    const value = '545A54';
    const operator = { $regex: '/[a-z]/' };
    const doMatch = $regex({ value, operator });

    expect(doMatch).toBe(false);
  });

  it('should return true when the regex "/[a-z]/i" matches the value using the flags', () => {
    const value = '545A54';
    const operator = { $regex: '/[a-z]/i' };
    const doMatch = $regex({ value, operator });

    expect(doMatch).toBe(true);
  });

  it('should return true when the regex "//" matches the value using the flags', () => {
    const value = '545a54';
    const operator = { $regex: '//' };
    const doMatch = $regex({ value, operator });

    expect(doMatch).toBe(true);
  });

  it('should return false when the regex pattern given to $regex is not a valid regex pattern', () => {
    const value = '545a54';
    const operator = { $regex: 'some invalid pattern' };
    const doMatch = $regex({ value, operator });

    expect(doMatch).toBe(false);
  });
});
