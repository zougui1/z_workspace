import * as logsService from '@zougui/logs-service';
import { threadList } from '@zougui/thread-list';

import { BaseLogger } from '../BaseLogger';
import { LoggerConfig, LoggerDatabaseConfig } from '../../config';
import { ILog } from '../../log';

export class DatabaseLogger extends BaseLogger<LoggerDatabaseConfig> {

  private _logs: Record<string, { log: ILog; callback: (err?: any) => void }> = {};
  private _logsService: typeof logsService = require('@zougui/logs-service');

  constructor(fullConfig: LoggerConfig, config: LoggerDatabaseConfig) {
    super('database', fullConfig, config);

    this.init();
  }

  //#region logging
  protected print(log: ILog): Promise<void> {
    this.emit('logged', log.logId);

    return new Promise<void>((resolve, reject) => {
      this._logs[log.logId] = {
        log,
        callback: err => {
          if (err) return reject(err);
          resolve();
        }
      };

      const { max } = this._config.batch.logCount;
      const logs = Object.values(this._logs);

      if (logs.length >= max) {
        this.sendLogs();
      }
    });
  }

  protected async sendLogs(): Promise<void> {
    const logs = Object.values(this._logs);
    const results = await this._logsService.createManyLogs(logs.map(log => log.log));

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const { logId } = result.value;
        delete this._logs[logId];
        logs[index].callback();
      } else {
        logs[index].callback(result.reason);
      }
    });
  }
  //#endregion

  //#region private
  private init(): void {
    const { interval } = this._config.batch;

    setInterval(() => {
      this.flush();
    }, interval);

    threadList.addCleanup(async () => {
      this.flush();
    });
  }

  private flush(): void {
    const { logCount } = this._config.batch;
    const logs = Object.values(this._logs);

    if (logs.length >= logCount.min) {
      this.sendLogs();
    }
  }
  //#endregion
}
