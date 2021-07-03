import { LogModel } from '@zougui/logs-database';
import { doTry } from '@zougui/error';

import { FindLogsError } from './errors';

export const findLogs = async (): Promise<LogModel.Instance[]> => {
  return await doTry(() => LogModel.query())
    .reject(error => new FindLogsError({ error }));
}
