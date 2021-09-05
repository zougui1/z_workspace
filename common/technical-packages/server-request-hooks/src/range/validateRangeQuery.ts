import { doTry } from '@zougui/error';

import { rangeQuerySchema } from './rangeQuerySchema';
import { RangeQueryValidationError } from './errors'

export const validateRangeQuery = async (query: any): Promise<RangeQuery> => {
  return await doTry<RangeQuery>(() => rangeQuerySchema.validateAsync(query))
    .reject(error => new RangeQueryValidationError({ error }));
}

export interface RangeQuery {
  skip: number;
  limit: number;
}
