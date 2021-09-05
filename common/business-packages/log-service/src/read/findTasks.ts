import { log } from '@zougui/log-database';
import { ILog } from '@zougui/log-types';

export const findTasks = async (taskId: string): Promise<ILog[]> => {
  return await log.findTasks(taskId);
}
