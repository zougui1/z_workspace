import { randomFloat } from '@zougui/utils';

import { OperatorContext } from '../OperatorContext';

export const $randomFloat = ({ operator }: OperatorContext<RandomFloatOperator>): number => {
  const [min, max] = operator.$randomFloat;
  return randomFloat(min, max);
}

export interface RandomFloatOperator {
  $randomFloat: [number, number];
}
