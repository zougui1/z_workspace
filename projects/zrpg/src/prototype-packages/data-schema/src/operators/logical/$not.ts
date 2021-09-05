import { runQuery } from '../runQuery';
import { OperatorContext } from '../OperatorContext';

export const $not = ({ value, operator }: OperatorContext<NotOperator>): boolean => {
  return !runQuery(value, operator.$not);
}

export interface NotOperator {
  $not: any;
}
