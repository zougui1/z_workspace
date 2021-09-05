//import _ from 'lodash';

import { match } from '../utils';
import { OperatorContext } from '../OperatorContext';

export const $eq = ({ value, operator }: OperatorContext<EqOperator>): boolean => {
  return match(value, operator.$eq);
}

export interface EqOperator {
  $eq: any;
}
