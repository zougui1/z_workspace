import { Exception } from '@zougui/error';

export interface RangeQueryValidationErrorData {
  error: any;
}

export const RangeQueryValidationError = new Exception<RangeQueryValidationErrorData>()
  .setCode('query.range.validation.error')
  .setMessage('Invalid range provided to the query')
  .setStatus(400)
  .toClass();
