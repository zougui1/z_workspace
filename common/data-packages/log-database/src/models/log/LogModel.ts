import { Model } from '@zougui/database-core';
import { LogLevel, LogContext, ILogTask, ILogTransaction } from '@zougui/log-types';

import { connectOnce } from '../../connect';

export class Log extends Model {
  static jsonAttributes = ['task', 'topics', 'transaction', 'context', 'data'];

  logId!: string;
  level!: LogLevel;
  task?: ILogTask;
  code!: string;
  topics!: string[];
  createdAt!: string;
  data!: Record<string, any>;
  transaction?: ILogTransaction;
  version!: string;
  context!: LogContext;
  message!: string;
}

export const LogModel = Log.connect(connectOnce);

export namespace LogModel {
  export type Instance = InstanceType<typeof LogModel>;
}
