import { runQuery } from '../runQuery';
import { OperatorContext } from '../OperatorContext';

export const $or = ({ value, operator }: OperatorContext<OrOperator>): boolean => {
  return operator.$or.some(query => runQuery(value, query));
}

export interface OrOperator {
  $or: any[];
}
