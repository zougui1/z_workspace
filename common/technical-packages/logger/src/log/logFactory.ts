import * as uuid from 'uuid';
import moment from 'moment';
import _ from 'lodash';
import StackTracey from 'stacktracey';
import { PartialDeep } from 'type-fest';

import { TransactionContext } from '@zougui/transaction-context';
import { LogKind, LogLevel, ILogTask, ILog, logFormat, ILogTransaction, LogContext as LogContextType } from '@zougui/log-types';

import { getContextData } from './getContextData';
import { LogContext, IConstructedLog } from './types';
import { LoggerConfig } from '../config';

export const logFactory = <T extends Record<string, any>>(log: LogPrototype<T>): (new (data: T) => IConstructedLog<T>) => {
  return class Log<TData extends T = T> implements IConstructedLog<TData> {

    readonly logKinds: LogKind[] = log.logKinds;
    readonly config?: (context: LogContext<TData>) => PartialDeep<LoggerConfig> = log.config;
    readonly logId: string = uuid.v4();
    level?: LogLevel;
    readonly code: string = log.code;
    task?: ILogTask;
    namespace?: string;
    readonly topics: string[] = log.topics;
    readonly message: (context: LogContext<TData>) => string = log.message;
    readonly transaction?: ILogTransaction;
    readonly createdAt: string = moment().format(logFormat);
    readonly data: TData;
    readonly version: string = log.version;
    readonly context: LogContextType;

    constructor(data: TData) {
      this.data = data;

      const stackTraceLimit = Error.stackTraceLimit;
      Error.stackTraceLimit = 2;
      const stackFrame = new StackTracey(new Error().stack).at(1);
      Error.stackTraceLimit = stackTraceLimit;

      this.context = getContextData(stackFrame);

      const transaction = log.transaction?.tryGetStore();

      if (transaction) {
        this.transaction = {
          ...transaction,
          time: {
            startedAt: moment(transaction.time.startedAt).format(logFormat),
            finishedAt: transaction.time.finishedAt && moment(transaction.time.finishedAt).format(logFormat),
          },
        };
      }
    }

    setTaskId(taskId: string): this {
      this.task = { id: taskId };
      return this;
    }

    setLevel(level: LogLevel): this {
      this.level = level;
      return this;
    }

    setNamespace(namespace: string): this {
      this.namespace = log.subNamespace
        ? `${namespace}:${log.subNamespace}`
        : namespace;
      return this;
    }

    setTaskTiming(timing: ILogTask['timing']): this {
      if (this.task) {
        this.task.timing = timing;
      }

      return this;
    }

    private checkMissingProperty(name: string): void {
      if (!_.get(this as any, name)) {
        throw new Error(`Cannot create a log without '${name}'`);
      }
    }

    private getLogContext(): LogContext<TData> {
      this.checkMissingProperty('level');

      const transaction = this.transaction && {
        ...this.transaction,
        time: {
          startedAt: this.transaction.time.startedAt,
          finishedAt: this.transaction.time.finishedAt,
        },
      };

      const context = {
        level: this.level || LogLevel.error,
        data: this.data,
        transaction,
        createdAt: moment(this.createdAt, logFormat),
        context: this.context,
      };

      return context;
    }

    getConfig(): PartialDeep<LoggerConfig> | undefined {
      return this.config?.(this.getLogContext());
    }

    getLog(): ILog<TData> {
      this.checkMissingProperty('namespace');

      const context = this.getLogContext();
      const transaction = context.transaction && {
        ...context.transaction,
        time: {
          startedAt: context.transaction.time.startedAt,
          finishedAt: context.transaction.time.finishedAt,
        },
      };

      return {
        logId: this.logId,
        level: context.level,
        code: this.code,
        task: this.task,
        topics: this.topics,
        namespace: this.namespace || '',
        message: this.message(context),
        transaction,
        createdAt: context.createdAt.format(logFormat),
        data: this.data,
        version: this.version,
        context: this.context,
      };
    }
  }
}

export type LogPrototype<T extends Record<string, any>> = {
  logKinds: LogKind[];
  subNamespace?: string;
  config?: (context: LogContext<T>) => PartialDeep<LoggerConfig>;
  code: string;
  topics: string[];
  message: (context: LogContext<T>) => string;
  transaction?: TransactionContext;
  version: string;
}
