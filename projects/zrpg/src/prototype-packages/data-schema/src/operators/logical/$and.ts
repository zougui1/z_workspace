import { runQuery } from '../runQuery';
import { OperatorContext } from '../OperatorContext';

export const $and = ({ value, operator }: OperatorContext<AndOperator>): boolean => {
  return operator.$and.every(query => runQuery(value, query));
}

export interface AndOperator {
  $and: any[];
}
