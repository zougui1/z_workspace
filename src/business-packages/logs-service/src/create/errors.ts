import { Exception } from '@zougui/error';

export interface CreateLogErrorData {
  error: any;
}

export const CreateLogError = new Exception<CreateLogErrorData>()
  .setCode('logs.create.error')
  .setMessage(({ error }) => `An error occurred while creating a log: ${error?.message || error || 'No error message provided.'}`)
  .setStatus(500)
  .toClass();
