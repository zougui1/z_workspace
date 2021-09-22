import { PartialDeep } from 'type-fest';

import { toFunction } from '@zougui/utils';
import { TransactionContext, transactionContext } from '@zougui/transaction-context';
import { LogKind } from '@zougui/log-types';

import { logFactory } from './logFactory';
import { LogContext, IConstructedLog } from './types';
import { LoggerConfig } from '../config';

export class LogBuilder<T extends Record<string, any>> {

  protected logKinds: LogKind[] = [];
  protected config?: (context: LogContext<T>) => PartialDeep<LoggerConfig>;
  protected code?: string;
  protected topics: string[] = [];
  protected message?: (context: LogContext<T>) => string;
  protected transaction?: TransactionContext;
  protected version?: string;
  protected subNamespace?: string;

  constructor() {
    this.setTransaction(transactionContext);
  }

  setLogKinds(logKinds: LogKind[]): this {
    this.logKinds = logKinds;
    return this;
  }

  setLocalLogKinds(): this {
    this.logKinds = [LogKind.console, LogKind.file];
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

  setSubNamespace(subNamespace: string): this {
    this.subNamespace = subNamespace;
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

  setVersion(version: string): this {
    this.version = version;
    return this;
  }

  protected checkMissingProperty(name: string): void {
    if (!(this as any)[name]) {
      throw new Error(`Cannot create a log without '${name}'`);
    }
  }

  toClass(): (new (data: T) => IConstructedLog<T>) {
    this.checkMissingProperty('code');
    this.checkMissingProperty('message');
    this.checkMissingProperty('version');

    const code = this.code || 'log.code.unknown';
    const version = this.version || '0.0';
    const message = this.message || (() => 'No message provided');

    return logFactory({
      logKinds: this.logKinds,
      subNamespace: this.subNamespace,
      config: this.config,
      code,
      topics: this.topics,
      message,
      transaction: this.transaction,
      version,
    });
  }
}
