import _ from 'lodash';

import { runQuery } from './runQuery';
import { QueryType } from './QueryType';

export const match = (value: any, other: any): boolean => {
  if (Array.isArray(value) && Array.isArray(other)) {
    const lengthsEqual = value.length === other.length;
    return lengthsEqual && other.every((toMatch, i) => {
      return match(value[i], toMatch)
    });
  }

  // since the above if checks iwpf BOTH are arrays
  // if this one passes then this means one is an array
  // and not the other
  if(Array.isArray(value) || Array.isArray(other)) {
    return false;
  }

  if (_.isObject(other)) {
    return runQuery(value, other);
  }

  return value === other;
}

export const getNumber = (value: any): number | undefined => {
  return _.isNumber(value)
    ? value
    : undefined;
}

export const getArray = (value: any): any[] => {
  return Array.isArray(value) ? value : [];
}

export const getQueryKind = (queryType?: QueryType): QueryType.test | QueryType.return => {
  switch (queryType) {
    case QueryType.return:
    case QueryType.returnAll:
      return QueryType.return;

    default:
      return QueryType.test;
  }
}

export const isTestQuery = (type?: QueryType): type is QueryType.test => {
  return getQueryKind(type) === QueryType.test;
}

export const isReturnQuery = (type?: QueryType): type is QueryType.return => {
  return getQueryKind(type) === QueryType.return;
}
