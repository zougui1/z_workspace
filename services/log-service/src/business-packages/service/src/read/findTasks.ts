import { ILog } from '@zougui/log-types';

import { log } from '@log-service/database';

export const findTasks = async (taskId: string): Promise<ILog[]> => {
  return await log.findTasks(taskId);
}
