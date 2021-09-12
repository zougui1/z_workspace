import { log, Log } from '@zougui/log-database';
import { ILog } from '@zougui/log-types';
import { doTry } from '@zougui/error';

import { FindLogsError } from './errors';

export const findLogs = async (options: Log.FindOptions): Promise<ILog[]> => {
  return await doTry(() => log.find(options))
    .reject(error => new FindLogsError({ error }));
}
