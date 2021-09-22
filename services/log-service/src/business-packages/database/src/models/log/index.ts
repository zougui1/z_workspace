import { findLogs, findTransactions, findTasks } from './read';
import { createLog } from './create';

import { FindLogsOptions } from './read';


export const log = {
  find: findLogs,
  findTransactions,
  findTasks,

  create: createLog,
};

export namespace Log {
  export type FindOptions = FindLogsOptions;
}
