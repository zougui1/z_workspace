import { Exception } from '@zougui/error';

export interface CreateLogErrorData {
  error: any;
}

export const CreateLogError = new Exception<CreateLogErrorData>()
  .setCode('logs.create.error')
  .setMessage('An error occurred while creating a log')
  .setStatus(500)
  .toClass();
