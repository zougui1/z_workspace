import { $in } from './$in';
import { OperatorContext } from '../OperatorContext';

export const $nin = ({ value, operator }: OperatorContext<NinOperator>): boolean => {
  return !$in({ value, operator: { $in: operator.$nin } });
}

export interface NinOperator {
  $nin: any[];
}
