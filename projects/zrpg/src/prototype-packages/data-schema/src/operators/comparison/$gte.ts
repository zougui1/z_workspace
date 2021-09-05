import _ from 'lodash';

import { getNumber } from '../utils';
import { OperatorContext } from '../OperatorContext';

export const $gte = ({ value, operator }: OperatorContext<GteOperator>): boolean => {
  const num = getNumber(value);
  return _.isNumber(num) && num >= operator.$gte;
}

export interface GteOperator {
  $gte: number;
}
