import _ from 'lodash';

import { getType } from '@zougui/utils';

import { OperatorContext } from '../OperatorContext';
import { isTestQuery } from '../utils';

export const $type = ({ value, operator, queryType }: OperatorContext<TypeOperator>): boolean | ReturnType<typeof getType> => {
  const valueType = getType(value);

  return isTestQuery(queryType)
    ? valueType === operator.$type
    : valueType;
}

export interface TypeOperator {
  $type: string | {};
}
