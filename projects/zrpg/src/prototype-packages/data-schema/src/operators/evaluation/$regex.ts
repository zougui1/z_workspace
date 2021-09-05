import _ from 'lodash';

import { OperatorContext } from '../OperatorContext';

const reRegexPattern = /^\/(.*)\/([a-z]*)?$/;

export const $regex = ({ value, operator }: OperatorContext<RegexOperator>): boolean => {
  const [_, pattern, flags] = (operator.$regex.match(reRegexPattern) || []) as (string | undefined)[];

  if (pattern === undefined) {
    return false;
  }

  return new RegExp(pattern || '', flags).test(value);
}

export interface RegexOperator {
  $regex: string;
}
