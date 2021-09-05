import { $pick } from './$pick';
import { PickOne } from '../utils';

describe('$pick()', () => {

  let randomSpy: jest.SpyInstance<number, []>;

  beforeEach(() => {
    randomSpy = jest.spyOn(Math, 'random');
  });

  afterEach(() => {
    randomSpy.mockRestore();
  });

  it('should return the value as is when it is not an instruction', () => {
    const pick = 'mein value'
    const result = $pick(pick);

    expect(result).toBe('mein value');
  });

  it('should return the third value based on a random number', () => {
    randomSpy.mockReturnValue(0.5)

    const pick = ['first value', 'second value', 'third value', 'fourth value'];
    const result = $pick(pick);

    expect(result).toBe('third value');
  });

  it('should randomly return the first value that has 50% chance of occuring based on a random number', () => {
    randomSpy.mockReturnValue(0.5)

    const values = ['first value', 'second value', 'third value', 'fourth value'];
    const pick: PickOne<string> = {
      $pick: {
        $resolve: 'single',
        $options: [
          {
            $chance: 50,
            $value: values[0],
          },
          {
            $chance: 5,
            $value: values[1],
          },
          {
            $chance: 100,
            $value: values[2],
          },
        ],
      }
    };

    const result = $pick(pick);
    expect(result).toBe('first value');
  });

  it('should randomly return all the values that has 45% chance or more of occuring based on a random number', () => {
    randomSpy.mockReturnValue(0.45)

    const values = [
      'first value', 'second value', 'third value',
      'fourth value', 'fifth value', 'sixth value',
      'seventh value', 'eighth value', 'ninth value',
    ];

    const pick: PickOne<string> = {
      $pick: {
        $resolve: 'multiple',
        $options: [
          {
            $chance: 45,
            $value: values[0],
          },
          {
            $chance: 5,
            $value: values[1],
          },
          {
            $chance: 100,
            $value: values[2],
          },
          {
            $chance: 44,
            $value: values[3],
          },
          {
            $chance: 44.99999,
            $value: values[4],
          },
          {
            $chance: 45.000001,
            $value: values[5],
          },
          {
            $chance: 78,
            $value: values[6],
          },
          {
            $chance: 69,
            $value: values[7],
          },
          {
            $chance: 42,
            $value: values[8],
          },
        ],
      }
    };

    const result = $pick(pick);
    expect(result).toEqual([values[0], values[5], values[7], values[6], values[2]]);
  });

  it('should not return the values that are condition and whose condition equals to false', () => {
    randomSpy.mockReturnValue(0.45)

    const values = ['first value', 'second value', 'third value', 'fourth value', 'fifth value'];

    const pick: PickOne<string> = {
      $pick: {
        $resolve: 'multiple',
        $options: [
          {
            $chance: 100,
            $value: values[0],
          },
          {
            $chance: 44,
            $value: values[1],
          },
          {
            $if: {
              $cond: false as any,
              $then: {
                $chance: 65,
                $value: values[2],
              },
            },
          },
          {
            $if: {
              $cond: false as any,
              $then: {
                $chance: 59,
                $value: values[3],
              },
            },
            $else: {
              $chance: 49,
              $value: values[4],
            }
          },
        ],
      }
    };

    const result = $pick(pick);
    expect(result).toEqual([values[4], values[0]]);
  });
});
