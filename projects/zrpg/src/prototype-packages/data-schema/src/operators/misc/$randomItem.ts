import { randomItem } from '@zougui/utils';

import { OperatorContext } from '../OperatorContext';

export const $randomItem = ({ value }: OperatorContext<RandomItemOperator>): any | undefined => {
  return Array.isArray(value) && value.length > 0
    ? randomItem(value)
    : undefined;
}

export interface RandomItemOperator {
  $randomItem: {};
}
