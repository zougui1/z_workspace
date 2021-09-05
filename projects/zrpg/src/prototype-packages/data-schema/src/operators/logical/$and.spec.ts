import { $and } from './$and';

describe('$and()', () => {
  it('should return true when every item match the value', () => {
    const value = 'Drache';
    const operator = {
      $and: ['Drache', 'Drache']
    };
    const result = $and({ value, operator });

    expect(result).toBe(true);
  });

  it('should return false when not every item match the value', () => {
    const value = 'Drache';
    const operator = {
      $and: ['kein Drache?! D:', 'Drache']
    };
    const result = $and({ value, operator });

    expect(result).toBe(false);
  });
});
