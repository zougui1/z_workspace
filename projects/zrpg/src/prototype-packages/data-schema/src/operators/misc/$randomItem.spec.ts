import { $randomItem } from './$randomItem';

describe('$randomItem()', () => {
  let randomSpy: jest.SpyInstance<number, []>;

  beforeEach(() => {
    randomSpy = jest.spyOn(Math, 'random').mockName('Math.random').mockReturnValue(0.5);
  });

  afterEach(() => {
    randomSpy.mockRestore();
  });

  it('should return an item from the array', () => {
    const value = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    const operator = {
      $randomItem: {},
    };
    const item = $randomItem({ value, operator });

    expect(randomSpy).toBeCalledTimes(1);
    expect(value).toContainEqual(item);
  });

  it('should return undefined if the value is not an array', () => {
    const value = { length: 45 };
    const operator = {
      $randomItem: {},
    };
    const item = $randomItem({ value, operator });

    expect(item).toBeUndefined();
  });

  it('should return undefined if the array is empty', () => {
    const value: any[] = [];
    const operator = {
      $randomItem: {},
    };
    const item = $randomItem({ value, operator });

    expect(item).toBeUndefined();
  });
});
