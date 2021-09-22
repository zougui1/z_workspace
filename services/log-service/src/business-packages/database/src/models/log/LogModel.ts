import { Model, Table, Log as Log } from '@zougui/database-core';
import { LogLevel, LogContext, ILogTask, ILogTransaction } from '@zougui/log-types';

import { connectOnce } from '../../connect';

@Log()
@Table(connectOnce)
export class LogModel extends Model {
  static jsonAttributes = ['task', 'topics', 'transaction', 'context', 'data'];

  logId!: string;
  level!: LogLevel;
  task?: ILogTask;
  code!: string;
  namespace!: string;
  topics!: string[];
  createdAt!: string;
  data!: Record<string, any>;
  transaction?: ILogTransaction;
  version!: string;
  context!: LogContext;
  message!: string;
}
