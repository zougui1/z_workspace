import { LogLevel } from './log-enums';
import { LogContext } from './LogContext';
import { ILogTask } from './ILogTask';
import { ILogTransaction } from './ILogTransaction';

export interface ILog<T extends Record<string, any> = any> {
  logId: string;
  level: LogLevel;
  code: string;
  task?: ILogTask;
  topics: string[];
  message: string;
  transaction?: ILogTransaction;
  createdAt: string;
  data: T;
  version: string;
  context: LogContext;
}
