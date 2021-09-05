import * as uuid from 'uuid';

import { Context } from '@zougui/context';
import { runAfter } from '@zougui/utils';

export class TransactionContext<T extends Record<string, any> = any> extends Context<TransactionContextStore<T>> {

  // TODO add an option not to "finish" the transaction automatically
  run<TResult>(data: Omit<TransactionContextStore<T>, 'id' | 'time'>, callback: () => TResult): TResult {
    const transaction = {
      id: uuid.v4(),
      topics: data.topics,
      data: data.data,
      time: {
        startedAt: new Date().toISOString(),
      },
    };

    const execute = () => runAfter(callback, () => this.finish());

    return super.run(transaction, execute);
  }

  finish(): void {
    const time = this.get('time');

    this.set('time', {
      ...time,
      finishedAt: new Date().toISOString(),
    });
  }
}

export const transactionContext = new TransactionContext();

export interface TransactionContextStore<T extends Record<string, any> = any> {
  id: string;
  topics: string[];
  data: T;
  time: {
    startedAt: string;
    finishedAt?: string;
  };
}
