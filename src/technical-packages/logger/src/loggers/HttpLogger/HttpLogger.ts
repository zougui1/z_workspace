import axios from 'axios';
import moment from 'moment';

import { threadList } from '@zougui/thread-list';

import { BaseLogger } from '../BaseLogger';
import { LoggerConfig, LoggerHttpConfig } from '../../config';
import { ILog } from '../../log';

export class HttpLogger extends BaseLogger<LoggerHttpConfig> {

  private _logs: Record<string, { log: ILog; callback: (err?: any) => void }> = {};

  constructor(fullConfig: LoggerConfig, config: LoggerHttpConfig) {
    super('http', fullConfig, config);

    this.init();
  }

  //#region logging
  protected print(log: ILog): Promise<void> {
    log.time.createdAt = moment(log.time.createdAt).format(log.time.format);
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
    this._logs = {};

    try {
      await axios.post(this._config.url, logs.map(log => log.log));
    } catch (error) {
      for (const { callback } of logs) {
        callback(error);
      }
    }

    for (const { log, callback } of logs) {
      delete this._logs[log.logId];
      callback();
    }
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
