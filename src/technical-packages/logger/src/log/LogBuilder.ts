import { PartialDeep } from 'type-fest';

import { toFunction } from '@zougui/utils';
import { TransactionContext } from '@zougui/transaction-context';

import { logFactory } from './logFactory';
import { ILogProfile, LogContext, IConstructedLog, ILogScope } from './types';
import { LogKind } from '../enums';
import { LoggerConfig } from '../config';

export class LogBuilder<T extends Record<string, any>> {

  protected logKinds: LogKind[] = [];
  protected config?: (context: LogContext<T>) => PartialDeep<LoggerConfig>;
  protected code?: string;
  protected scope?: Partial<ILogScope>;
  protected topics: string[] = [];
  protected message?: (context: LogContext<T>) => string;
  protected transaction?: TransactionContext;
  protected profile?: {
    label: (context: LogContext<T>) => string;
    timing?: ILogProfile['timing'];
  };

  setLogKinds(logKinds: LogKind[]): this {
    this.logKinds = logKinds;
    return this;
  }

  setLocalLogKinds(): this {
    this.logKinds = [LogKind.console, LogKind.file, LogKind.database];
    return this;
  }

  setOptions(config: PartialDeep<LoggerConfig> | ((context: LogContext<T>) => PartialDeep<LoggerConfig>)): this {
    this.config = toFunction(config);
    return this;
  }

  setCode(code: string): this {
    this.code = code;
    return this;
  }

  setScope(scope: Partial<ILogScope>): this {
    this.scope = {
      name: scope.name,
      version: scope.version,
    };
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

  setTransaction(transaction: TransactionContext): this {
    this.transaction = transaction;
    return this;
  }

  setProfile(label: string | ((context: LogContext<T>) => string)): this {
    this.profile = { label: toFunction(label) };
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
    const scope: ILogScope = (this.scope || {} as ILogScope) as ILogScope;
    scope.name ||= 'unknown-scope-name';
    scope.version ||= '0.0.0';
    const message = this.message || (() => 'No message provided');

    return logFactory({
      logKinds: this.logKinds,
      config: this.config,
      code: code,
      scope: scope,
      topics: this.topics,
      message: message,
      transaction: this.transaction,
      profile: this.profile,
    });
  }
}
