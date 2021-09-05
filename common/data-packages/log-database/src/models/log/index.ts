import { findLogs, findTransactions, findTasks } from './read';
import { createLog } from './create';

import { LogModel } from './LogModel';
import { FindLogsOptions } from './read';


export const log = {
  find: findLogs,
  findTransactions,
  findTasks,

  create: createLog,

  LogModel,
};

export namespace Log {
  export type FindOptions = FindLogsOptions;
}
