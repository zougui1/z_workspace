import moment from 'moment';
import { PartialDeep } from 'type-fest';

import { TransactionContextStore } from '@zougui/transaction-context';
import { LogKind, LogLevel, ILogTask, ILog, ILogTransaction, LogContext as LogContextType } from '@zougui/log-types';

import { LoggerConfig } from '../config';

export interface LogContext<T extends Record<string, any>> {
  level: LogLevel;
  data: T;
  createdAt: moment.Moment;
  context: LogContextType;
  transaction?: TransactionContextStore;
}

export interface IConstructedLog<T extends Record<string, any> = any> {
  readonly logKinds: LogKind[];
  readonly config?: (context: LogContext<T>) => PartialDeep<LoggerConfig>;
  readonly logId: string;
  level?: LogLevel;
  readonly code: string;
  readonly task?: ILogTask;
  readonly topics: string[];
  readonly message: (context: LogContext<T>) => string;
  readonly transaction?: ILogTransaction;
  readonly createdAt: string;
  readonly data: T;
  readonly version: string;
  readonly context: LogContextType;

  setTaskId(taskId: string): this;
  setTaskTiming(timing: ILogTask['timing']): this;
  setLevel(level: LogLevel): this;
  getConfig(): PartialDeep<LoggerConfig> | undefined;
  getLog(): ILog<T>;
}
