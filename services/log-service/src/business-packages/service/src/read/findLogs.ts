import { ILog } from '@zougui/log-types';
import { doTry } from '@zougui/error';

import { log, Log } from '@log-service/database';

import { FindLogsError } from './errors';

export const findLogs = async (options: Log.FindOptions): Promise<ILog[]> => {
  return await doTry(() => log.find(options))
    .reject(error => new FindLogsError({ error }));
}
