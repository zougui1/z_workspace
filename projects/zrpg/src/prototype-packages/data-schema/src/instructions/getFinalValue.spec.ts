import { getFinalValue } from './getFinalValue';
import { PickOne } from '../utils';

describe('getFinalValue()', () => {

  let randomSpy: jest.SpyInstance<number, []>;

  beforeEach(() => {
    randomSpy = jest.spyOn(Math, 'random');
  });

  afterEach(() => {
    randomSpy.mockRestore();
  });

  it('should return "value from $if -> second "$else if" -> third value -> 45% chance -> $else"', () => {
    randomSpy.mockReturnValueOnce(0.9);
    randomSpy.mockReturnValueOnce(0.45);

    const pick: PickOne<string> = {
      $if: {
        $cond: {},
        $then: {
          $if: {
            $cond: false as any,
            $then: 'value from $if -> $if',
          },
          '$else if': [
            {
              $cond: false as any,
              $then: 'value from $if -> first "$else if"',
            },
            {
              $cond: {},
              $then: [
                'value from $if -> second "$else if" -> first value',
                'value from $if -> second "$else if" -> second value',
                {
                  $pick: {
                    $resolve: 'single',
                    $options: [
                      {
                        $chance: 45,
                        $value: {
                          $if: {
                            $cond: false as any,
                            $then: 'value from $if -> second "$else if" -> third value -> 45% chance -> $if',
                          },
                          $else: 'value from $if -> second "$else if" -> third value -> 45% chance -> $else',
                        },
                      },
                      {
                        $chance: 5,
                        $value: 'value from $if -> second "$else if" -> third value -> 5% chance',
                      },
                      {
                        $chance: 100,
                        $value: 'value from $if -> second "$else if" -> third value -> 100% chance',
                      },
                    ]
                  },
                },
              ],
            },
            {
              $cond: {},
              $then: 'value from $if -> third "$else if"',
            },
          ],
        }
      }
    };
    const result = getFinalValue(pick);

    expect(result).toBe('value from $if -> second "$else if" -> third value -> 45% chance -> $else');
  });
});
