import { $not } from './$not';

describe('$not()', () => {
  it('should return true when the item does not match the value', () => {
    const value = true;
    const operator = {
      $not: false
    };
    const result = $not({ value, operator });

    expect(result).toBe(true);
  });

  it('should return false when the item matches the value', () => {
    const value = true;
    const operator = {
      $not: true
    };
    const result = $not({ value, operator });

    expect(result).toBe(false);
  });
});
