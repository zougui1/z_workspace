import _ from 'lodash';

import { match } from './utils';

describe('match()', () => {
  it('should return true when 2 primitives match', () => {
    const value = 4;
    const toMatch = 4;
    const doMatch = match(value, toMatch);

    expect(doMatch).toBe(true);
  });

  it('should return false when 2 primitives do not match', () => {
    const value = 4;
    const toMatch = 69;
    const doMatch = match(value, toMatch);

    expect(doMatch).toBe(false);
  });

  it('should return true when the value matches', () => {
    const value = {
      mein: 'value',
      someOtherProperty: 'should not be matched against the matcher'
    };
    const toMatch = { mein: 'value' };
    const doMatch = match(value, toMatch);

    expect(doMatch).toBe(true);
  });

  it('should return false when 2 objects do not match', () => {
    const value = { mein: 'value' };
    const toMatch = { mein: 'Drache' };
    const doMatch = match(value, toMatch);

    expect(doMatch).toBe(false);
  });

  it('should return true when 2 arrays match', () => {
    const value = [4, 8];
    const toMatch = [4, 8];
    const doMatch = match(value, toMatch);

    expect(doMatch).toBe(true);
  });

  it('should return false when both arrays do not have the same length', () => {
    const value = [4, 8];
    const toMatch: any[] = [];
    const doMatch = match(value, toMatch);

    expect(doMatch).toBe(false);
  });

  it('should return false when 2 arrays do not match', () => {
    const value = [4, 8];
    const toMatch = [6, 9];
    const doMatch = match(value, toMatch);

    expect(doMatch).toBe(false);
  });

  it('should return false when the value is an array and the matcher an object', () => {
    const value: any = [];
    const toMatch = {};
    const doMatch = match(value, toMatch);

    expect(doMatch).toBe(false);
  });

  it('should return false when the value is an object and the matcher an array', () => {
    const value = {};
    const toMatch: any = [];
    const doMatch = match(value, toMatch);

    expect(doMatch).toBe(false);
  });

  it('should return true when 2 object match, the matcher using dot notation ', () => {
    const value = { es: { ist: { mein: 'value' } } };
    const toMatch = { 'es.ist.mein': 'value' };
    const doMatch = match(value, toMatch);

    expect(doMatch).toBe(true);
  });

  it('should return true when 2 object match, both the value and the matcher using dot notation', () => {
    const value = { 'es.ist.mein': 'value' };
    const toMatch = { 'es.ist.mein': 'value' };
    const doMatch = match(value, toMatch);

    expect(doMatch).toBe(true);
  });

  it('should match complex data structures', () => {
    const value = {
      this: {
        is: {
          my: ['super', {
            very: {
              nested: [
                {
                  property: 'within',
                  so: {
                    many: ['level', 'this', 'is', 'crazy']
                  }
                }
              ]
            }
          }]
        },
        'es.ist.ein': { Feuer: 'Drache' },
      },
      my: ['very', 'special', 'array']
    };
    const toMatch = {
      'this.is.my[0]': 'super',
      'this.is.my[1].very.nested[0].property': 'within',
      this: {
        'es.ist.ein': { Feuer: 'Drache' }
      },
      my: ['very', 'special', 'array']
    };
    const doMatch = match(value, toMatch);

    expect(doMatch).toBe(true);
  });
});
