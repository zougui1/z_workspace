import StackTracey from 'stacktracey';

import { toFunction } from '@zougui/utils';

import { LogKind } from '../LogKind';
import { ILogTime, ILogContext } from '../types';

export interface ILogObject<TData extends Record<string, any> = any> {
  data: TData;
  logKinds: LogKind[];
  topics: string[];
  options: ContextLogOptions<TData>;
  profile?: {
    label: string,
    timing?: {
      formatted: string;
      milliseconds: number;
    };
  };
  message?: (context: LogContext<TData>) => string;
  code?: string;
  file: string;
  line?: number;
  functionName: string;
  time?: ILogTime;
  context?: ILogContext;

  getData(): TData;
  getTime(): ILogTime;
  getContext(): ILogContext;
  getMessage(): string;
  getOptions(): StaticLogOptions;
  getOption<K extends LogKind>(logKind: K): StaticLogOptions[K] | undefined;
}

export class Log<T extends Record<string, any>> {

  logKinds: LogKind[] = [];
  topics: string[] = [];
  options: ContextLogOptions<T> = {};
  profile?: {
    label: string,
    timing?: {
      formatted: string;
      milliseconds: number;
    };
  };
  message?: (context: LogContext<T>) => string;
  code?: string;

  setCode(code: string): this {
    this.code = code;
    return this;
  }

  setLogKinds(logKinds: LogKind[]): this {
    this.logKinds = logKinds;
    return this;
  }

  setLocalLogKinds(): this {
    this.logKinds = [LogKind.console, LogKind.file];
    return this;
  }

  setTopics(topics: string[]): this {
    this.topics = topics;
    return this;
  }

  setProfile(profile: string): this {
    this.profile = {
      label: profile,
    };
    return this;
  }

  setMessage(message: string | ((context: LogContext<T>) => string)): this {
    this.message = toFunction(message);
    return this;
  }

  setOptions(options: LogOptions<T>): this {
    for (const logKind of Object.values(LogKind)) {
      if (options[logKind]) {
        this.setOption(logKind, options[logKind]);
      }
    }

    return this;
  }

  setOption<K extends LogKind>(logKind: K, options: LogOptions<T>[K]): this {
    this.options[logKind] = toFunction<LogOptions<T>[K], [LogContext<T>]>(options);
    return this;
  }

  setFileOptions(options: LogOptions<T>[LogKind.file]): this {
    return this.setOption(LogKind.file, options);
  }

  setDiscordOptions(options: LogOptions<T>[LogKind.discord]): this {
    return this.setOption(LogKind.discord, options);
  }

  toClass() {
    const self = this;

    return class LogClass<TData extends T = T> implements ILogObject<TData> {

      static readonly code = self.code;

      data: TData;
      logKinds: LogKind[] = self.logKinds;
      topics: string[] = self.topics;
      options: ContextLogOptions<TData> = self.options;
      profile?: {
        label: string;
        timing?: {
          formatted: string;
          milliseconds: number;
        };
      } = self.profile;
      message?: (context: LogContext<TData>) => string = self.message;
      code?: string = self.code;
      file: string;
      line?: number;
      functionName: string;
      time?: ILogTime;
      context?: ILogContext;

      constructor(data: TData) {
        this.data = data;

        const stackTraceLimit = Error.stackTraceLimit;
        Error.stackTraceLimit = 2;
        const stackFrame = new StackTracey(new Error().stack).at(1);
        Error.stackTraceLimit = stackTraceLimit;

        this.file = stackFrame.file;
        this.line = stackFrame.line;
        this.functionName = stackFrame.callee;
      }

      getData(): TData {
        if (!this.data) {
          throw new Error('Cannot get the message of a log that has no values set.');
        }

        return this.data;
      }

      getTime(): ILogTime {
        if (!this.time) {
          throw new Error('Cannot get the message of a log that has no time set.');
        }

        return this.time;
      }

      getContext(): ILogContext {
        if (!this.context) {
          throw new Error('Cannot get the message of a log that has no context set.');
        }

        return this.context;
      }

      getLogContext(): LogContext<TData> {
        return {
          data: this.getData(),
          time: this.getTime(),
          context: this.getContext(),
        };
      }

      getMessage(): string {
        if (!this.time) {
          throw new Error('Cannot get the message of a log that has no time set.');
        }
        if (!this.context) {
          throw new Error('Cannot get the message of a log that has no context set.');
        }

        return this.message?.(this.getLogContext()) ?? 'No message defined.';
      }


      getOptions(): StaticLogOptions {
        const opts: StaticLogOptions = {};

        for (const logKind of Object.values(LogKind)) {
          const option = this.options[logKind];

          if (option) {
            opts[logKind] = option(this.getLogContext());
          }
        }

        return opts;
      }

      getOption<K extends LogKind>(logKind: K): StaticLogOptions[K] | undefined {
        return this.options[logKind]?.(this.getLogContext());
      }
    }
  }
}

export interface LogContext<T extends Record<string, any>> {
  data: T;
  time: ILogTime;
  context: ILogContext;
}

export interface StaticLogOptions {
  [LogKind.discord]?: LogDiscordOptions;
  [LogKind.file]?: LogFileOptions;
  [LogKind.console]?: any;
  [LogKind.email]?: any;
}

export interface ContextLogOptions<T extends Record<string, any>> {
  [LogKind.discord]?: (ctx: LogContext<T>) => LogDiscordOptions;
  [LogKind.file]?: (ctx: LogContext<T>) => LogFileOptions;
  [LogKind.console]?: (ctx: LogContext<T>) => any;
  [LogKind.email]?: (ctx: LogContext<T>) => any;
}

export interface LogOptions<T extends Record<string, any>> {
  [LogKind.discord]?: StaticLogOptions[LogKind.discord] | ContextLogOptions<T>[LogKind.discord];
  [LogKind.file]?: StaticLogOptions[LogKind.file] | ContextLogOptions<T>[LogKind.file];
  [LogKind.console]?: StaticLogOptions[LogKind.console] | ContextLogOptions<T>[LogKind.console];
  [LogKind.email]?: StaticLogOptions[LogKind.email] | ContextLogOptions<T>[LogKind.email];
}

export interface LogDiscordOptions {
  server?: string;
  category?: string;
  channel?: string;
  ensureChannel?: boolean;
}

export interface LogFileOptions {
  file?: string;
}
