import _ from 'lodash';

import { OperatorContext } from '../OperatorContext';

export const $exists = ({ prevValue, field, operator }: OperatorContext<ExistsOperator>): boolean => {
  if (!field) {
    return !!prevValue === operator.$exists;
  }

  return _.has(prevValue, field) === operator.$exists;
}

export interface ExistsOperator {
  $exists: boolean;
}
