import _ from 'lodash';

import { getNumber } from '../utils';
import { OperatorContext } from '../OperatorContext';

export const $lte = ({ value, operator }: OperatorContext<LteOperator>): boolean => {
  const num = getNumber(value);
  return _.isNumber(num) && num <= operator.$lte;
}

export interface LteOperator {
  $lte: number;
}
