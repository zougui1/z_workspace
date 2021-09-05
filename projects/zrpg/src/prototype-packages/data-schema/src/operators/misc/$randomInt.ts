import { random } from '@zougui/utils';

import { OperatorContext } from '../OperatorContext';

export const $randomInt = ({ operator }: OperatorContext<RandomIntOperator>): number => {
  const [min, max] = operator.$randomInt;
  return random(min, max);
}

export interface RandomIntOperator {
  $randomInt: [number, number];
}
