import { $length } from './$length';
import { QueryType } from '../QueryType';

describe('$length()', () => {
  describe('test value', () => {
    it('should return false if the value is not an array nor a string', () => {
      const value = { length: 4 };
      const operator = { $length: 4 };
      const doMatch = $length({ value, operator });

      expect(doMatch).toBe(false);
    });

    it('should return true if the length of the array is equal to the specified size', () => {
      const value = [0, 1, 2, 3];
      const operator = { $length: 4 };
      const doMatch = $length({ value, operator });

      expect(doMatch).toBe(true);
    });

    it('should return false if the length of the array is not equal to the specified size', () => {
      const value = [0, 1, 2, 3];
      const operator = { $length: 5 };
      const doMatch = $length({ value, operator });

      expect(doMatch).toBe(false);
    });

    it('should return true if the length of the string is equal to the specified size', () => {
      const value = 'abcd';
      const operator = { $length: 4 };
      const doMatch = $length({ value, operator });

      expect(doMatch).toBe(true);
    });

    it('should return false if the length of the string is not equal to the specified size', () => {
      const value = 'abcd';
      const operator = { $length: 5 };
      const doMatch = $length({ value, operator });

      expect(doMatch).toBe(false);
    });
  });

  describe('return result', () => {
    it('should return the length of the array when it is a query of type return', () => {
      const value = [0, 1, 2, 3];
      const operator = { $length: {} };
      const queryType = QueryType.return;
      const length = $length({ value, operator, queryType });

      expect(length).toBe(4);
    });

    it('should return the length of the string when it is a query of type return', () => {
      const value = 'abcd';
      const operator = { $length: {} };
      const queryType = QueryType.return;
      const length = $length({ value, operator, queryType });

      expect(length).toBe(4);
    });

    it('should return undefined when the value is neither an array or a string it is a query of type return', () => {
      const value = {
        length: 4,
      };
      const operator = { $length: {} };
      const queryType = QueryType.return;
      const length = $length({ value, operator, queryType });

      expect(length).toBeUndefined();
    });
  });
});
