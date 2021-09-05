import { randomIndex } from '@zougui/utils';

import { OperatorContext } from '../OperatorContext';

export const $randomIndex = ({ value }: OperatorContext<RandomIndexOperator>): number | undefined => {
  return Array.isArray(value) && value.length > 0
    ? randomIndex(value)
    : undefined;
}

export interface RandomIndexOperator {
  $randomIndex: {};
}
