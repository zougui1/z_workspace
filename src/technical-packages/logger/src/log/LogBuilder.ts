import { toFunction } from '@zougui/utils';

import { logFactory } from './logFactory';
import { ILogProfile, LogContext, IConstructedLog } from './types';
import { LogKind } from '../enums';
import { LoggerConfig } from '../config';

export class LogBuilder<T extends Record<string, any>> {

  protected logKinds: LogKind[] = [];
  protected config?: (context: LogContext<T>) => LoggerConfig;
  protected code?: string;
  protected scope?: string;
  protected topics: string[] = [];
  protected message?: (context: LogContext<T>) => string;
  protected profile?: ILogProfile;

  setLogKinds(logKinds: LogKind[]): this {
    this.logKinds = logKinds;
    return this;
  }

  setLocalLogKinds(): this {
    this.logKinds = [LogKind.console, LogKind.file, LogKind.database];
    return this;
  }

  setOptions(config: LoggerConfig | ((context: LogContext<T>) => LoggerConfig)): this {
    this.config = toFunction(config);
    return this;
  }

  setCode(code: string): this {
    this.code = code;
    return this;
  }

  setScope(scope: string): this {
    this.scope = scope;
    return this;
  }

  setTopics(topics: string[]): this {
    this.topics = topics;
    return this;
  }

  setMessage(message: string | ((context: LogContext<T>) => string)): this {
    this.message = toFunction(message);
    return this;
  }

  setProfile(label: string): this {
    this.profile = { label };
    return this;
  }

  protected checkMissingProperty(name: string): void {
    if (!(this as any)[name]) {
      throw new Error(`Cannot create a log without '${name}'`);
    }
  }

  toClass(): (new (data: T) => IConstructedLog<T>) {
    this.checkMissingProperty('code');
    this.checkMissingProperty('scope');
    this.checkMissingProperty('message');

    const code = this.code || 'log.code.unknown';
    const scope = this.scope || 'log.scope.unknown';
    const message = this.message || (() => 'No message provided');

    return logFactory({
      logKinds: this.logKinds,
      config: this.config,
      code: code,
      scope: scope,
      topics: this.topics,
      message: message,
      profile: this.profile,
    });
  }
}
