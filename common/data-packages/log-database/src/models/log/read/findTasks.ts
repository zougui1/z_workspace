import { raw } from 'objection';

import { ILog } from '@zougui/log-types';

import { LogModel } from '../LogModel';
import { createdAtDate } from '../sql-utils';

export const findTasks = async (taskId: string): Promise<ILog[]> => {
  const logs = await LogModel
    .query()
    .where(raw('JSON_EXTRACT(task, "$.id") = ?', taskId))
    .orderBy(createdAtDate(), 'DESC');
  return logs;
}

// Thursday, September 4, 1986 8:30 PM

// dddd, MMMM D, YYYY hh:mm:ss.SSS A
