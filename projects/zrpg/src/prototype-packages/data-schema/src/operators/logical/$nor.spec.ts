import { $nor } from './$nor';

describe('$nor()', () => {
  it('should return false when at least one item match the value', () => {
    const value = false;
    const operator = {
      $nor: [false, null, true, undefined]
    };
    const result = $nor({ value, operator });

    expect(result).toBe(false);
  });

  it('should return true when no items match the value', () => {
    const value = false;
    const operator = {
      $nor: [null, true, undefined]
    };
    const result = $nor({ value, operator });

    expect(result).toBe(true);
  });
});
