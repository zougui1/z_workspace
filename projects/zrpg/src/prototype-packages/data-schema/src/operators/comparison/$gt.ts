import _ from 'lodash';

import { getNumber } from '../utils';
import { OperatorContext } from '../OperatorContext';

export const $gt = ({ value, operator }: OperatorContext<GtOperator>): boolean => {
  const num = getNumber(value);
  return _.isNumber(num) && num > operator.$gt;
}

export interface GtOperator {
  $gt: number;
}
