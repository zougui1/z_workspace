import { Exception } from '@zougui/error';

export interface PaginationQueryValidationErrorData {
  error: any;
}

export const PaginationQueryValidationError = new Exception<PaginationQueryValidationErrorData>()
  .setCode('query.pagination.validation.error')
  .setMessage('Invalid pagination provided to the query')
  .setStatus(400)
  .toClass();
