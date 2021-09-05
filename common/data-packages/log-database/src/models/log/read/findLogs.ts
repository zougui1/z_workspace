import { ILog } from '@zougui/log-types';

import { LogModel } from '../LogModel';
import { createdAtDate } from '../sql-utils';

export const findLogs = async (options: FindLogsOptions): Promise<ILog[]> => {
  const { page, pageSize } = options;

  const res = await LogModel
    .query()
    .page(page, pageSize)
    // order by descending order of the `createdAt` date as JSON string
    .orderBy(createdAtDate(), 'DESC');
  return res.results;
}

export interface FindLogsOptions {
  page: number;
  pageSize: number;
}
