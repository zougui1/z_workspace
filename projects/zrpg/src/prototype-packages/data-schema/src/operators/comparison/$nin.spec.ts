import { $nin } from './$nin';

describe('$nin()', () => {
  it('should return false when the value as primitive is nin the array', () => {
    const value = 5;
    const operator = { $nin: [1, 5, 7, 8] };
    const doMatch = $nin({ value, operator });

    expect(doMatch).toBe(false);
  });

  it('should return true when the value as primitive is not nin the array', () => {
    const value = 6;
    const operator = { $nin: [1, 5, 7, 8] };
    const doMatch = $nin({ value, operator });

    expect(doMatch).toBe(true);
  });

  it('should return false when the value as object is nin the array', () => {
    const value = { mein: 'Drache' };
    const operator = {
      $nin: [
        { mein: 'sudo' },
        { mein: 'linux' },
        { mein: 'Drache' },
        { mein: 'window' },
      ]
    };
    const doMatch = $nin({ value, operator });

    expect(doMatch).toBe(false);
  });

  it('should return true when the value as object is not nin the array', () => {
    const value = { mein: 'OS' };
    const operator = {
      $nin: [
        { mein: 'sudo' },
        { mein: 'linux' },
        { mein: 'Drache' },
        { mein: 'window' },
      ]
    };
    const doMatch = $nin({ value, operator });

    expect(doMatch).toBe(true);
  });
});
