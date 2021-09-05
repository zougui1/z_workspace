import _ from 'lodash';

import { getNumber } from '../utils';
import { OperatorContext } from '../OperatorContext';

export const $lt = ({ value, operator }: OperatorContext<LtOperator>): boolean => {
  const num = getNumber(value);
  return _.isNumber(num) && num < operator.$lt;
}

export interface LtOperator {
  $lt: number;
}
