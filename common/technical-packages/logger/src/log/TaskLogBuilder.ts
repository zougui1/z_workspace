import { PartialDeep } from 'type-fest';

import { TransactionContext } from '@zougui/transaction-context';
import { LogKind } from '@zougui/log-types';

import { LogBuilder } from './LogBuilder';
import { taskLogFactory, TaskLogs } from './taskLogFactory';
import { LogContext, IConstructedLog } from './types';
import { LoggerConfig } from '../config';

export class TaskLogBuilder<T extends Record<string, any>, TError extends Record<string, any> = {}, TSuccess extends Record<string, any> = {}> {

  protected readonly start: LogBuilder<T> = new LogBuilder();
  protected readonly success: LogBuilder<T & TSuccess> = new LogBuilder();
  protected readonly error: LogBuilder<T & TError & { error?: any }> = new LogBuilder();

  setLogKinds(logKinds: LogKind[]): this {
    this.start.setLogKinds(logKinds);
    this.success.setLogKinds(logKinds);
    this.error.setLogKinds(logKinds);

    return this;
  }

  setLocalLogKinds(): this {
    this.start.setLocalLogKinds();
    this.success.setLocalLogKinds();
    this.error.setLocalLogKinds();

    return this;
  }

  setOptions(config: PartialDeep<LoggerConfig> | ((context: LogContext<T>) => PartialDeep<LoggerConfig>)): this {
    this.start.setOptions(config);
    this.success.setOptions(config);
    this.error.setOptions(config);

    return this;
  }

  setCode(code: string): this {
    this.start.setCode(`${code}.start`);
    this.success.setCode(`${code}.success`);
    this.error.setCode(`${code}.error`);

    return this;
  }

  setTopics(topics: string[]): this {
    this.start.setTopics(topics);
    this.success.setTopics(topics);
    this.error.setTopics(topics);

    return this;
  }

  setMessages(messages: TaskMessages<T, TError, TSuccess>): this {
    this.start.setMessage(messages.start);
    this.success.setMessage(messages.success);
    this.error.setMessage(messages.error);

    return this;
  }

  setTransaction(transaction: TransactionContext): this {
    this.start.setTransaction(transaction);
    this.success.setTransaction(transaction);
    this.error.setTransaction(transaction);

    return this;
  }

  setVersion(version: string): this {
    this.start.setVersion(version);
    this.success.setVersion(version);
    this.error.setVersion(version);

    return this;
  }

  toClass(): (new (data: T, taskId?: string) => TaskLogs<T, TError & { error?: any }, TSuccess>) {
    return taskLogFactory<T, TError & { error?: any }, TSuccess>({
      Start: this.start.toClass(),
      Success: this.success.toClass() as (new (data: T & TSuccess) => IConstructedLog<TSuccess>),
      Error: this.error.toClass() as (new (data: T & TError & { error?: any }) => IConstructedLog<TError & { error?: any }>),
    });
  }
}

export interface TaskMessages<T extends Record<string, any>, TError extends Record<string, any> = {}, TSuccess extends Record<string, any> = {}> {
  start: string | ((context: LogContext<T>) => string);
  success: string | ((context: LogContext<T & TSuccess>) => string);
  error: string | ((context: LogContext<T & TError & { error?: any }>) => string);
}
