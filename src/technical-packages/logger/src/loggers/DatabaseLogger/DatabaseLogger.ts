import { createManyLogs } from '@zougui/logs-service';

import { BaseLogger } from '../BaseLogger';
import { LoggerConfig, LoggerDatabaseConfig } from '../../config';
import { ILog } from '../../log';

export class DatabaseLogger extends BaseLogger<LoggerDatabaseConfig> {

  private _logs: Record<string, { log: ILog; callback: (err?: any) => void }> = {};

  constructor(fullConfig: LoggerConfig, config: LoggerDatabaseConfig) {
    super('database', fullConfig, config);

    this.init();
  }

  //#region logging
  protected print(log: ILog): Promise<void> {
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
    const results = await createManyLogs(logs.map(log => log.log));

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const { logId } = result.value;
        this.emit('logged', logId);
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
    const { interval, logCount } = this._config.batch;

    setInterval(() => {
      const logs = Object.values(this._logs);

      if (logs.length >= logCount.min) {
        this.sendLogs();
      }
    }, interval);
  }
  //#endregion
}
