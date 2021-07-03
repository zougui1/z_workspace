import { LogModel } from '@zougui/logs-database';
import { doTry } from '@zougui/error';

import { CreateLogError } from './errors';
import { validateLog } from '../validations';

export const createLog = async (log: any): Promise<LogModel.Instance> => {
  const validLog = await validateLog(log);

  LogModel.query().insert()
  return await doTry(() => LogModel.query().insert(validLog))
    .reject(error => new CreateLogError({ error }));
}

export const createManyLogs = async (logs: any[]): Promise<PromiseSettledResult<LogModel.Instance>[]> => {
  return await Promise.allSettled(logs.map(log => createLog(log)));
}
