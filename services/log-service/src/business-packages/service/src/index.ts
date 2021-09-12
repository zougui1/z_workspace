import { Log as LogDb } from '@zougui/log-database';

import { createLog, createManyLogs, CreateLogError, CreateLogErrorData } from './create';
import { findLogs, findTransactions, findTasks, FindLogsError, FindLogsErrorData } from './read';
import { LogValidationError, LogValidationErrorData } from './validations';

export const log = {
  create: createLog,
  createMany: createManyLogs,
  CreateError: CreateLogError,
  ValidationError: LogValidationError,

  find: findLogs,
  findTransactions,
  findTasks,
  FindError: FindLogsError,
};

export namespace Log {
  export type FindOptions = LogDb.FindOptions;
  export type ValidationErrorData = LogValidationErrorData;
  export type CreateErrorData = CreateLogErrorData;
  export type FindErrorData = FindLogsErrorData;
}
