import { match, getArray } from '../utils';
import { OperatorContext } from '../OperatorContext';

export const $all = ({ value, operator }: OperatorContext<AllOperator>): boolean => {
  const arr = getArray(value);
  return operator.$all.every(item => arr.some(val => match(val, item)));
}

export interface AllOperator {
  $all: any[];
}
