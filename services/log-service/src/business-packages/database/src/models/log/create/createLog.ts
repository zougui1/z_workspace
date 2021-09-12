import { ILog } from '@zougui/log-types';

import { LogModel } from '../LogModel';

export const createLog = async (log: ILog): Promise<ILog> => {
  return await LogModel.query().insert(log);
}
