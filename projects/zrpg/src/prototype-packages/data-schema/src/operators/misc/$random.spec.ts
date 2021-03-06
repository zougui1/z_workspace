import { $random } from './$random';

describe('$random()', () => {
  let randomSpy: jest.SpyInstance<number, []>;

  beforeEach(() => {
    randomSpy = jest.spyOn(Math, 'random').mockName('Math.random').mockReturnValue(0.5);
  });

  afterEach(() => {
    randomSpy.mockRestore();
  });

  it('should return a number generated by `Math.random()`', () => {
    const num = $random();

    expect(randomSpy).toBeCalledTimes(1);
    expect(typeof num).toBe('number');
  });
});
