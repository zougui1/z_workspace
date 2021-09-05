import { match } from '../utils';
import { OperatorContext } from '../OperatorContext';

export const $in = ({ value, operator }: OperatorContext<InOperator>): boolean => {
  return operator.$in.some(item => match(value, item));
}

export interface InOperator {
  $in: any[];
}
