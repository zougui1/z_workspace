import { $in } from './$in';

describe('$in()', () => {
  it('should return true when the value as primitive is in the array', () => {
    const value = 5;
    const operator = { $in: [1, 5, 7, 8] };
    const doMatch = $in({ value, operator });

    expect(doMatch).toBe(true);
  });

  it('should return false when the value as primitive is not in the array', () => {
    const value = 6;
    const operator = { $in: [1, 5, 7, 8] };
    const doMatch = $in({ value, operator });

    expect(doMatch).toBe(false);
  });

  it('should return true when the value as object is in the array', () => {
    const value = { mein: 'Drache' };
    const operator = {
      $in: [
        { mein: 'sudo' },
        { mein: 'linux' },
        { mein: 'Drache' },
        { mein: 'window' },
      ]
    };
    const doMatch = $in({ value, operator });

    expect(doMatch).toBe(true);
  });

  it('should return false when the value as object is not in the array', () => {
    const value = { mein: 'OS' };
    const operator = {
      $in: [
        { mein: 'sudo' },
        { mein: 'linux' },
        { mein: 'Drache' },
        { mein: 'window' },
      ]
    };
    const doMatch = $in({ value, operator });

    expect(doMatch).toBe(false);
  });
});
