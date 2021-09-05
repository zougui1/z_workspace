import { $exists } from './$exists';

describe('$exists()', () => {
  it('should return true if it does not exist and require it to exist', () => {
    const prevValue = { myProp: undefined };
    const field = 'myProp';
    const operator = { $exists: true };
    const doMatch = $exists({ prevValue, field, operator });

    expect(doMatch).toBe(true);
  });

  it('should return false if it exists and require it not to exist', () => {
    const prevValue = { myProp: undefined };
    const field = 'myProp';
    const operator = { $exists: false };
    const doMatch = $exists({ prevValue, field, operator });

    expect(doMatch).toBe(false);
  });

  it('should return true if it does not exist and require it not to exist', () => {
    const prevValue = { };
    const field = 'myProp';
    const operator = { $exists: false };
    const doMatch = $exists({ prevValue, field, operator });

    expect(doMatch).toBe(true);
  });

  it('should return false if it does not exist and require it not to exist', () => {
    const prevValue = { };
    const field = 'myProp';
    const operator = { $exists: true };
    const doMatch = $exists({ prevValue, field, operator });

    expect(doMatch).toBe(false);
  });

  it('should return true if the prevValue is truthy, no field is specified and is required to exist', () => {
    const prevValue = { };
    const field = undefined;
    const operator = { $exists: true };
    const doMatch = $exists({ prevValue, field, operator });

    expect(doMatch).toBe(true);
  });

  it('should return false if the prevValue is truthy, no field is specified and is required not to exist', () => {
    const prevValue = { };
    const field = undefined;
    const operator = { $exists: false };
    const doMatch = $exists({ prevValue, field, operator });

    expect(doMatch).toBe(false);
  });

  it('should return false if the prevValue is falsy, no field is specified and is required to exist', () => {
    const prevValue = false;
    const field = undefined;
    const operator = { $exists: true };
    const doMatch = $exists({ prevValue, field, operator });

    expect(doMatch).toBe(false);
  });

  it('should return true if the prevValue is falsy, no field is specified and is required not to exist', () => {
    const prevValue = null;
    const field = undefined;
    const operator = { $exists: false };
    const doMatch = $exists({ prevValue, field, operator });

    expect(doMatch).toBe(true);
  });
});
