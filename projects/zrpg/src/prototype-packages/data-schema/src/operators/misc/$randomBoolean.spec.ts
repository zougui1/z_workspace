import { $randomBoolean } from './$randomBoolean';

describe('$randomBoolean()', () => {
  let randomSpy: jest.SpyInstance<number, []>;

  beforeEach(() => {
    randomSpy = jest.spyOn(Math, 'random').mockName('Math.random').mockReturnValue(0.5);
  });

  afterEach(() => {
    randomSpy.mockRestore();
  });

  it('should return a boolean', () => {
    const bool = $randomBoolean();

    expect(randomSpy).toBeCalledTimes(1);
    expect(typeof bool).toBe('boolean');
  });
});
