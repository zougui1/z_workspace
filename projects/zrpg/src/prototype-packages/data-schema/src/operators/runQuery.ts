import _ from 'lodash';

import { $eq, $ne, $gt, $lt, $gte, $lte, $in, $nin } from './comparison'
import { $and, $or, $nor, $not } from './logical'
import { $all, $length } from './array'
import { $exists, $type } from './element'
import { $regex } from './evaluation'
import { $random, $randomBoolean, $randomFloat, $randomIndex, $randomInt, $randomItem } from './misc';
import { OperatorContext } from './OperatorContext';
import { QueryType } from './QueryType';

// the following operators are tested:
// $eq, $ne, $gt, $lt, $gte, $lte, $and, $regex, $in, $nin, $or, $nor, $not, $all, $type, $exists, $length
// TODO the following operators NEED to be tested:
// TODO $random, $randomInt, $randomFloat, $randomBoolean, $randomIndex, $randomItem

const operators = {
  $eq,
  $ne,
  $in,
  $nin,
  $gt,
  $lt,
  $gte,
  $lte,
  $regex,
  $type,
  $exists,
  $all,
  $length,
  $or,
  $nor,
  $not,
  $and,
  $random,
  $randomBoolean,
  $randomFloat,
  $randomIndex,
  $randomInt,
  $randomItem,
} as Record<string, ((context: OperatorContext) => any) | undefined>;

export const runQuery = (value: any, query: any, prevValue?: any, field?: string): any => {
  if (!_.isObject(query)) {
    return value === query;
  }

  const queryObj: Record<string, any> = query;
  const queryType = getQueryType(queryObj);
  const evaluableQuery = queryObj.$return || queryObj.$returnAll || queryObj.$test || query;

  const clauses = Object.keys(evaluableQuery).map(key => {
    if (key.startsWith('$')) {
      const operator = operators[key];

      if (!operator) {
        throw new Error(`invalid operator "${key}"`);
      }

      return operator({
        value,
        prevValue,
        field,
        operator: evaluableQuery,
        queryType,
      });
    }

    const subValue = _.get(value, key);
    const subQuery = _.get(evaluableQuery, key);

    return runQuery(subValue, subQuery, value, key);
  });

  if (queryType === 'test') {
    return clauses.every(clause => clause);
  } else if (queryType === 'returnAll') {
    return clauses;
  }

  return clauses[0];
}

const getQueryType = (query: Record<string, any>): QueryType => {
  if (query.$return) {
    return QueryType.return;
  }

  if (query.$returnAll) {
    return QueryType.returnAll;
  }

  return QueryType.test;
}
