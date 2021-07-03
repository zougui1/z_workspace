import os from 'os';

import * as uuid from 'uuid';
import moment from 'moment';
import _ from 'lodash';
import StackTracey from 'stacktracey';

import env from '@zougui/env';

import { ILog, ILogProfile, ILogContext, LogContext, IConstructedLog } from './types';
import { LogKind, LogLevel } from '../enums';
import { LoggerConfig } from '../config';

export const logFactory = <T extends Record<string, any>>(log: LogPrototype<T>): (new (data: T) => IConstructedLog<T>) => {
  return class Log<TData extends T = T> implements IConstructedLog<TData> {

    readonly logKinds: LogKind[] = log.logKinds;
    readonly config?: (context: LogContext<TData>) => LoggerConfig = log.config;
    readonly logId: string = uuid.v4();
    level?: LogLevel;
    readonly code: string = log.code;
    readonly scope: string = log.scope;
    readonly topics: string[] = log.topics;
    readonly message: (context: LogContext<TData>) => string = log.message;
    readonly profile?: ILogProfile = log.profile;
    readonly time: { createdAt: moment.Moment; format?: string } = { createdAt: moment() };
    readonly data: TData;
    readonly context: ILogContext;

    constructor(data: TData) {
      this.data = data;

      const stackTraceLimit = Error.stackTraceLimit;
      Error.stackTraceLimit = 3;
      const stackFrame = new StackTracey(new Error().stack).at(2);
      Error.stackTraceLimit = stackTraceLimit;

      this.context = {
        app: {
          env: env.NODE_ENV,
          name: env.PROJECT_NAME,
          file: stackFrame.file,
          line: stackFrame.line,
          functionName: stackFrame.callee,
          nodeVersion: process.version,
        },
        os: {
          platform: process.platform,
          version: os.release(),
        },
        process: {
          processId: process.pid,
          user: os.userInfo().username,
        },
      };
    }

    setLevel(level: LogLevel): this {
      this.level = level;
      return this;
    }

    setTimeFormat(timeFormat: string): this {
      this.time.format = timeFormat;
      return this;
    }

    setProfileTiming(timing: ILogProfile['timing']): this {
      if (this.profile) {
        this.profile.timing = timing;
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
      this.checkMissingProperty('time.format');

      const time = {
        createdAt: this.time.createdAt,
        format: this.time.format || 'YYYY-MM-DD hh:mm:ss.SSS A',
      };

      const context = {
        level: this.level || LogLevel.error,
        data: this.data,
        time,
        context: this.context,
      };

      return context;
    }

    getConfig(): LoggerConfig | undefined {
      return this.config?.(this.getLogContext());
    }

    getLog(): ILog<TData> {
      const context = this.getLogContext();

      return {
        logId: this.logId,
        level: context.level,
        code: this.code,
        scope: this.scope,
        topics: this.topics,
        message: this.message(context),
        profile: this.profile,
        time: context.time,
        data: this.data,
        context: this.context,
      };
    }
  }
}

export type LogPrototype<T extends Record<string, any>> = {
  logKinds: LogKind[];
  config?: (context: LogContext<T>) => LoggerConfig;
  code: string;
  scope: string;
  topics: string[];
  message: (context: LogContext<T>) => string;
  profile?: ILogProfile;
}
