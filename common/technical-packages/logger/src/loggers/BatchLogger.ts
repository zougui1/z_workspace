import isBrowser from 'is-browser';

import { threadList } from '@zougui/thread-list';
import { ILog } from '@zougui/log-types';
import { toMs } from '@zougui/utils';

import { BaseLogger } from './BaseLogger';
import { LoggerConfig, LoggerBaseConfig, BatchConfig } from '../config';

export abstract class BatchLogger<TConf extends (LoggerBaseConfig & { batch: BatchConfig })> extends BaseLogger<TConf, BatchEmitter> {

  private _logs: Record<string, BatchedLog> = {};

  constructor(name: string, fullConfig: LoggerConfig, config: TConf) {
    super(name, fullConfig, config);

    this.init();
  }

  //#region logging
  protected async print(log: ILog): Promise<void> {
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
        this.flush();
      }
    });
  }

  protected abstract sendLogs(logs: BatchedLog[]): Promise<void>;
  //#endregion

  //#region helpers
  private init(): void {
    const { interval } = this._config.batch;
    const flush = () => this.flush();
    const msInterval = toMs(interval as any);

    if (isNaN(msInterval)) {
      throw new Error(`Invalid interval, expected a number or a parseable string. Got ${interval}`);
    }

    console.log('interval', interval, msInterval);

    setInterval(flush, msInterval);
    threadList.addCleanup(flush);

    if (isBrowser) {
      window.onbeforeunload = flush;
    }

    this.on('batch-logged', logs => {
      for (const { log, callback } of logs) {
        delete this._logs[log.logId];
        callback();
      }
    });

    this.on('batch-error', logs => {
      for (const { error, callback } of logs) {
        callback(error);
      }
    });
  }

  private async flush(): Promise<void> {
    const { logCount } = this._config.batch;
    const logs = Object.values(this._logs);

    if (logs.length >= logCount.min) {
      for (const { log } of logs) {
        delete this._logs[log.logId];
      }

      await this.sendLogs(logs);
    }
  }
  //#endregion
}

export type BatchedLog = { log: ILog; callback: (err?: any) => void };
type BatchEmitter = {
  'batch-logged': BatchedLog[];
  'batch-error': (BatchedLog & { error: any })[];
};
