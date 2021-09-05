import { $or } from './$or';

describe('$or()', () => {
  it('should return true when at least one item match the value', () => {
    const value = false;
    const operator = {
      $or: [false, null, true, undefined]
    };
    const result = $or({ value, operator })

    expect(result).toBe(true);
  });

  it('should return false when no items match the value', () => {
    const value = false;
    const operator = {
      $or: [null, true, undefined]
    };
    const result = $or({ value, operator });

    expect(result).toBe(false);
  });
});
