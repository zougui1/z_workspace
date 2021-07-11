import * as logsService from '@zougui/logs-service';
import { separate } from '@zougui/utils';

import { BatchLogger, BatchedLog } from '../BatchLogger';
import { LoggerConfig, LoggerDatabaseConfig } from '../../config';

export class DatabaseLogger extends BatchLogger<LoggerDatabaseConfig> {

  private _logsService: typeof logsService = require('@zougui/logs-service');

  constructor(fullConfig: LoggerConfig, config: LoggerDatabaseConfig) {
    super('database', fullConfig, config);
  }

  //#region logging
  protected async sendLogs(logs: BatchedLog[]): Promise<void> {
    const results = await this._logsService.createManyLogs(logs.map(log => log.log));

    const logsWithError = logs.map((log, i) => {
      const result = results[i];
      const error = result.status === 'rejected' ? result.reason : undefined;
      return { ...log, error };
    });

    const [errorLogs, successLogs] = separate(logsWithError, log => log.error);

    this.emit('batch-error', errorLogs);
    this.emit('batch-logged', successLogs);
  }
  //#endregion
}
