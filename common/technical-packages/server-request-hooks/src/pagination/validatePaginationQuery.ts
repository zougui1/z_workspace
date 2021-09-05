import { doTry } from '@zougui/error';

import { paginationQuerySchema } from './paginationQuerySchema';
import { PaginationQueryValidationError } from './errors'

export const validatePaginationQuery = async (query: any): Promise<PaginationQuery> => {
  return await doTry<PaginationQuery>(() => paginationQuerySchema.validateAsync(query))
    .reject(error => new PaginationQueryValidationError({ error }));
}

export interface PaginationQuery {
  page: number;
  pageSize: number;
}
