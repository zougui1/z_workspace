import { $all } from './$all';

describe('$all()', () => {
  it('should return true when the value as primitive is in the array', () => {
    const value = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const operator = { $all: [1, 5, 7, 8] };
    const doMatch = $all({ value, operator });

    expect(doMatch).toBe(true);
  });

  it('should return false when the value as primitive is not in the array', () => {
    const value = [5, 6, 7, 8, 9];
    const operator = { $all: [1, 5, 7, 8] };
    const doMatch = $all({ value, operator });

    expect(doMatch).toBe(false);
  });

  it('should return true when the value as object is in the array', () => {
    const value = [
      { mein: 'sudo' },
      { mein: 'linux' },
      { mein: 'Drache' },
      { mein: 'window' },
      { mein: 'mac' },
      { mein: 'darwin' },
      { mein: 'win32' },
    ];
    const operator = {
      $all: [
        { mein: 'sudo' },
        { mein: 'linux' },
        { mein: 'Drache' },
        { mein: 'window' },
      ]
    };
    const doMatch = $all({ value, operator });

    expect(doMatch).toBe(true);
  });

  it('should return false when the value as object is not in the array', () => {
    const value = [
      { mein: 'sudo' },
      { mein: 'linux' },
      { mein: 'Drache' },
      { mein: 'window' },
      { mein: 'mac' },
      { mein: 'darwin' },
      { mein: 'win32' },
    ];
    const operator = {
      $all: [
        { mein: 'os' },
        { mein: 'linux' },
      ]
    };
    const doMatch = $all({ value, operator });

    expect(doMatch).toBe(false);
  });
});
