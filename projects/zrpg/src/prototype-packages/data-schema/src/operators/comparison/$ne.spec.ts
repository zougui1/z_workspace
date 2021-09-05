import _ from 'lodash';

import { $ne } from './$ne';

describe('ne()', () => {
  it('should return false when 2 primitives match', () => {
    const value = 4;
    const operator = { $ne: 4 };
    const doMatch = $ne({ value, operator });

    expect(doMatch).toBe(false);
  });

  it('should return true when 2 primitives do not match', () => {
    const value = 4;
    const operator = { $ne: 69 };
    const doMatch = $ne({ value, operator });

    expect(doMatch).toBe(true);
  });

  it('should return false when the value matches', () => {
    const value = { mein: 'value' };
    const operator = { $ne: { mein: 'value' } };
    const doMatch = $ne({ value, operator });

    expect(doMatch).toBe(false);
  });

  it('should return true when 2 objects do not match', () => {
    const value = { mein: 'value' };
    const operator = { $ne: { mein: 'Drache' } };
    const doMatch = $ne({ value, operator });

    expect(doMatch).toBe(true);
  });

  it('should return false when 2 arrays match', () => {
    const value = [4, 8];
    const operator = { $ne: [4, 8] };
    const doMatch = $ne({ value, operator });

    expect(doMatch).toBe(false);
  });

  it('should return true when both arrays do not have the same length', () => {
    const value = [4, 8];
    const operator = { $ne: [4] };
    const doMatch = $ne({ value, operator });

    expect(doMatch).toBe(true);
  });

  it('should return true when 2 arrays do not match', () => {
    const value = [4, 8];
    const operator = { $ne: [6, 9] };
    const doMatch = $ne({ value, operator });

    expect(doMatch).toBe(true);
  });

  it('should return true when the value is an array and the matcher an object', () => {
    const value: any = [];
    const operator = { $ne: {} };
    const doMatch = $ne({ value, operator });

    expect(doMatch).toBe(true);
  });

  it('should return true when the value is an object and the matcher an array', () => {
    const value = {};
    const operator: any = { $ne: [] };
    const doMatch = $ne({ value, operator });

    expect(doMatch).toBe(true);
  });
});
