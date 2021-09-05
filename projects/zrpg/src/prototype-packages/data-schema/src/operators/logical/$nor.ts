import { $or } from './$or';
import { OperatorContext } from '../OperatorContext';

export const $nor = ({ operator, ...ctx }: OperatorContext<NorOperator>): boolean => {
  return !$or({ ...ctx, operator: { $or: operator.$nor } });
}

export interface NorOperator {
  $nor: any[];
}
