import { ILog } from '@zougui/log-types';
import { doTry } from '@zougui/error';

import { log } from '@log-service/database';

import { CreateLogError } from './errors';
import { validateLog } from '../validations';

export const createLog = async (logData: any): Promise<ILog> => {
  const validLog = await validateLog(logData);

  return await doTry(() => log.create(validLog))
    .reject(error => new CreateLogError({ error }));
}

export const createManyLogs = async (logs: any[]): Promise<PromiseSettledResult<ILog>[]> => {
  return await Promise.allSettled(logs.map(log => createLog(log)));
}
