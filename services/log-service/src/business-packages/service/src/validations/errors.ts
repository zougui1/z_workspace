import { Exception } from '@zougui/error';

export interface LogValidationErrorData {
  error: any;
}

export const LogValidationError = new Exception<LogValidationErrorData>()
  .setCode('logs.create.validation.error')
  .setMessage('Invalid log data')
  .setStatus(400)
  .toClass();
