import * as uuid from 'uuid';
import StackTracey from 'stacktracey';

import { runSuccess, runError } from '@zougui/utils';

import { IConstructedLog } from './types';
import { Logger } from '../loggers';

export const taskLogFactory = <T extends Record<string, any>, TError extends Record<string, any>, TSuccess extends Record<string, any>>(tasks: Tasks<T, TError, TSuccess>): (new (data: T, taskId?: string) => TaskLogs<T, TError, TSuccess>) => {
  return class TaskLog implements TaskLogs<T, TError & { error?: any }, TSuccess> {
    readonly taskId: string;
    readonly data: T;
    _start?: IConstructedLog<T>;
    _success?: IConstructedLog<TSuccess>;
    _error?: IConstructedLog<TError & { error?: any }>;

    constructor(data: T, taskId?: string) {
      this.data = data;
      this.taskId = taskId || uuid.v4();
    }

    _getSourceLocation(): { file: string; callee: string; line?: number; } {
      const stackTraceLimit = Error.stackTraceLimit;
      Error.stackTraceLimit = 3;
      const stackFrame = new StackTracey(new Error().stack).at(2);
      Error.stackTraceLimit = stackTraceLimit;

      const file = stackFrame.file;
      const line = stackFrame.line;
      const callee = stackFrame.callee;

      return { file, callee, line };
    }

    exec<T>(task: (() => T), logger: Logger | OnLog<T, TSuccess, TError>): T {
      const onLogs = logger instanceof Logger
        ? {
          onStart: logger.info,
          onSuccess: logger.info,
          onError: logger.error,
        }
        : logger

      const logStart = () => onLogs.onStart(this.start() as any);
      const logError = (error: any) => onLogs.onError(this.error({ error } as (TError & { error: any })) as any);
      const logSuccess = () => onLogs.onSuccess(this.success({} as TSuccess) as any);

      const execTask = (): T => {
        logStart();
        return task();
      }

      return runError(() => runSuccess(execTask, logSuccess), logError);
    }

    start(): IConstructedLog<T> {
      const { file, callee, line } = this._getSourceLocation();

      this._start = new tasks.Start(this.data).setTaskId(this.taskId);
      this._start.context.app.file = file;
      this._start.context.app.line = line;
      this._start.context.app.functionName = callee;

      return this._start;
    }

    success(data: TSuccess): IConstructedLog<TSuccess> {
      const { file, callee, line } = this._getSourceLocation();

      this._success = new tasks.Success({
        ...this.data,
        ...data,
      }).setTaskId(this.taskId);
      this._success.context.app.file = file;
      this._success.context.app.line = line;
      this._success.context.app.functionName = callee;

      return this._success;
    }

    error(data: TError & { error?: any }): IConstructedLog<TError & { error?: any }> {
      const { file, callee, line } = this._getSourceLocation();

      this._error = new tasks.Error({
        ...this.data,
        ...data,
      }).setTaskId(this.taskId);
      this._error.context.app.file = file;
      this._error.context.app.line = line;
      this._error.context.app.functionName = callee;

      return this._error;
    }
  }
}

export interface Tasks<T extends Record<string, any>, TError extends Record<string, any>, TSuccess extends Record<string, any>> {
  Start: new (data: T) => IConstructedLog<T>;
  Success: new (data: T & TSuccess) => IConstructedLog<TSuccess>;
  Error: new (data: T & TError & { error?: any }) => IConstructedLog<TError & { error?: any }>;
}

export interface TaskLogs<T extends Record<string, any>, TError extends Record<string, any>, TSuccess extends Record<string, any>> {
  readonly taskId: string;

  start: () => IConstructedLog<T>;
  success: (data: TSuccess) => IConstructedLog<TSuccess>;
  error: (data: TError & { error?: any }) => IConstructedLog<TError & { error?: any }>;
  exec<T>(task: (() => T), onLog: Logger | OnLog<T, TSuccess, TError>): T;
}

export interface OnLog<T extends Record<string, any>, TError extends Record<string, any>, TSuccess extends Record<string, any>> {
  onStart: (log: IConstructedLog<T>) => void;
  onSuccess: (log: IConstructedLog<TSuccess>) => void;
  onError: (log: IConstructedLog<TError & { error?: any }>) => void;
}
