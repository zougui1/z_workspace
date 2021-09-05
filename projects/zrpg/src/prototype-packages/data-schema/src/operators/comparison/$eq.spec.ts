import _ from 'lodash';

import { $eq } from './$eq';

describe('eq()', () => {
  it('should return true when 2 primitives match', () => {
    const value = 4;
    const operator = { $eq: 4 };
    const doMatch = $eq({ value, operator });

    expect(doMatch).toBe(true);
  });

  it('should return false when 2 primitives do not match', () => {
    const value = 4;
    const operator = { $eq: 69 };
    const doMatch = $eq({ value, operator });

    expect(doMatch).toBe(false);
  });

  it('should return true when the value matches', () => {
    const value = { mein: 'value' };
    const operator = { $eq: { mein: 'value' } };
    const doMatch = $eq({ value, operator });

    expect(doMatch).toBe(true);
  });

  it('should return false when 2 objects do not match', () => {
    const value = { mein: 'value' };
    const operator = { $eq: { mein: 'Drache' } };
    const doMatch = $eq({ value, operator });

    expect(doMatch).toBe(false);
  });

  it('should return true when 2 arrays match', () => {
    const value = [4, 8];
    const operator = { $eq: [4, 8] };
    const doMatch = $eq({ value, operator });

    expect(doMatch).toBe(true);
  });

  it('should return false when both arrays do not have the same length', () => {
    const value = [4, 8];
    const operator = { $eq: [4] };
    const doMatch = $eq({ value, operator });

    expect(doMatch).toBe(false);
  });

  it('should return false when 2 arrays do not match', () => {
    const value = [4, 8];
    const operator = { $eq: [6, 9] };
    const doMatch = $eq({ value, operator });

    expect(doMatch).toBe(false);
  });

  it('should return false when the value is an array and the matcher an object', () => {
    const value: any = [];
    const operator = { $eq: {} };
    const doMatch = $eq({ value, operator });

    expect(doMatch).toBe(false);
  });

  it('should return false when the value is an object and the matcher an array', () => {
    const value = {};
    const operator: any = { $eq: [] };
    const doMatch = $eq({ value, operator });

    expect(doMatch).toBe(false);
  });
});
