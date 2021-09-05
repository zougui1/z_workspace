import { $eq } from './$eq';
import { OperatorContext } from '../OperatorContext';

export const $ne = ({ operator, ...ctx }: OperatorContext<NeOperator>): boolean => {
  return !$eq({ ...ctx, operator: { $eq: operator.$ne } });
}

export interface NeOperator {
  $ne: any;
}
