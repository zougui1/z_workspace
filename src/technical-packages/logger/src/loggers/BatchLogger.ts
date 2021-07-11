import { threadList } from '@zougui/thread-list';

import { BaseLogger } from './BaseLogger';
import { LoggerConfig, LoggerBaseConfig, BatchConfig } from '../config';
import { ILog } from '../log';

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

    setInterval(() => this.flush(), interval);
    threadList.addCleanup(() => this.flush());

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

  private flush(): void {
    const { logCount } = this._config.batch;
    const logs = Object.values(this._logs);

    if (logs.length >= logCount.min) {
      this._logs = {};
      this.sendLogs(logs);
    }
  }
  //#endregion
}

export type BatchedLog = { log: ILog; callback: (err?: any) => void };
type BatchEmitter = {
  'batch-logged': BatchedLog[];
  'batch-error': (BatchedLog & { error: any })[];
};
