import { Exception } from '@zougui/error';

export interface FindLogsErrorData {
  error: any;
}

export const FindLogsError = new Exception<FindLogsErrorData>()
  .setCode('logs.find.error')
  .setMessage('An error occured while retrieving logs')
  .setStatus(500)
  .toClass();
