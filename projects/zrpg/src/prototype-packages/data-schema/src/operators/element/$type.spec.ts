import { $type } from './$type';
import { QueryType } from '../QueryType';

describe('$type()', () => {
  describe('test value', () => {
    it('should return true if the value is required to be undefined and it is undefined', () => {
      const value = undefined;
      const operator = { $type: 'undefined' };
      const doMatch = $type({ value, operator });

      expect(doMatch).toBe(true);
    });

    it('should return false if the value is required to be undefined and it is not undefined', () => {
      const value = 5;
      const operator = { $type: 'undefined' };
      const doMatch = $type({ value, operator });

      expect(doMatch).toBe(false);
    });

    it('should return true if the value is required to be null and it is null', () => {
      const value = null;
      const operator = { $type: 'null' };
      const doMatch = $type({ value, operator });

      expect(doMatch).toBe(true);
    });

    it('should return false if the value is required to be null and it is not null', () => {
      const value = 5;
      const operator = { $type: 'null' };
      const doMatch = $type({ value, operator });

      expect(doMatch).toBe(false);
    });

    it('should return true if the value is required to be a number and it is a number', () => {
      const value = 45;
      const operator = { $type: 'number' };
      const doMatch = $type({ value, operator });

      expect(doMatch).toBe(true);
    });

    it('should return false if the value is required to be a number and it is not a number', () => {
      const value = '5';
      const operator = { $type: 'number' };
      const doMatch = $type({ value, operator });

      expect(doMatch).toBe(false);
    });

    it('should return true if the value is required to be a string and it is a string', () => {
      const value = 'gdfr';
      const operator = { $type: 'string' };
      const doMatch = $type({ value, operator });

      expect(doMatch).toBe(true);
    });

    it('should return false if the value is required to be a string and it is not a string', () => {
      const value = 5;
      const operator = { $type: 'string' };
      const doMatch = $type({ value, operator });

      expect(doMatch).toBe(false);
    });

    it('should return true if the value is required to be an array and it is an array', () => {
      const value: any[] = [];
      const operator = { $type: 'array' };
      const doMatch = $type({ value, operator });

      expect(doMatch).toBe(true);
    });

    it('should return false if the value is required to be an array and it is not an array', () => {
      const value = 5;
      const operator = { $type: 'array' };
      const doMatch = $type({ value, operator });

      expect(doMatch).toBe(false);
    });

    it('should return true if the value is required to be an object and it is an object', () => {
      const value = {};
      const operator = { $type: 'object' };
      const doMatch = $type({ value, operator });

      expect(doMatch).toBe(true);
    });

    it('should return false if the value is required to be an object and it is not an object', () => {
      const value = 5;
      const operator = { $type: 'object' };
      const doMatch = $type({ value, operator });

      expect(doMatch).toBe(false);
    });

    it('should return true if the value is required to be a boolean and it is false', () => {
      const value = false;
      const operator = { $type: 'boolean' };
      const doMatch = $type({ value, operator });

      expect(doMatch).toBe(true);
    });

    it('should return true if the value is required to be a boolean and it is true', () => {
      const value = true;
      const operator = { $type: 'boolean' };
      const doMatch = $type({ value, operator });

      expect(doMatch).toBe(true);
    });

    it('should return false if the value is required to be a boolean and it is not a boolean', () => {
      const value = 5;
      const operator = { $type: 'boolean' };
      const doMatch = $type({ value, operator });

      expect(doMatch).toBe(false);
    });

    it('should return true if the value is required to be a date and it is a date', () => {
      const value = new Date();
      const operator = { $type: 'date' };
      const doMatch = $type({ value, operator });

      expect(doMatch).toBe(true);
    });

    it('should return false if the value is required to be a date and it is not a date', () => {
      const value = 5;
      const operator = { $type: 'date' };
      const doMatch = $type({ value, operator });

      expect(doMatch).toBe(false);
    });
  });

  describe('return result', () => {
    const queryType = QueryType.return;

    it('should return \'undefined\' if the value is undefined', () => {
      const value = undefined;
      const operator = { $type: {} };
      const doMatch = $type({ value, operator, queryType });

      expect(doMatch).toBe('undefined');
    });

    it('should return \'null\' if the value is null', () => {
      const value = null;
      const operator = { $type: {} };
      const doMatch = $type({ value, operator, queryType });

      expect(doMatch).toBe('null');
    });

    it('should return \'number\' if the value is a number', () => {
      const value = 45;
      const operator = { $type: {} };
      const doMatch = $type({ value, operator, queryType });

      expect(doMatch).toBe('number');
    });

    it('should return \'string\' if the value is a string', () => {
      const value = 'gdfr';
      const operator = { $type: {} };
      const doMatch = $type({ value, operator, queryType });

      expect(doMatch).toBe('string');
    });

    it('should return \'array\' if the value is an array', () => {
      const value: any[] = [];
      const operator = { $type: {} };
      const doMatch = $type({ value, operator, queryType });

      expect(doMatch).toBe('array');
    });

    it('should return \'object\' if the value is an object', () => {
      const value = {};
      const operator = { $type: {} };
      const doMatch = $type({ value, operator, queryType });

      expect(doMatch).toBe('object');
    });

    it('should return \'boolean\' if the value is false', () => {
      const value = false;
      const operator = { $type: {} };
      const doMatch = $type({ value, operator, queryType });

      expect(doMatch).toBe('boolean');
    });

    it('should return \'boolean\' if the value is true', () => {
      const value = true;
      const operator = { $type: {} };
      const doMatch = $type({ value, operator, queryType });

      expect(doMatch).toBe('boolean');
    });

    it('should return \'date\' if the value is a date', () => {
      const value = new Date();
      const operator = { $type: {} };
      const doMatch = $type({ value, operator, queryType });

      expect(doMatch).toBe('date');
    });
  });
});
