import axios from 'axios';

import { ILog } from '@zougui/log-types';

import { BatchLogger, BatchedLog } from '../BatchLogger';
import { LoggerConfig, LoggerHttpConfig } from '../../config';

export class HttpLogger extends BatchLogger<LoggerHttpConfig> {

  constructor(fullConfig: LoggerConfig, config: LoggerHttpConfig) {
    super('http', fullConfig, config);
  }

  //#region logging
  protected async print(log: ILog): Promise<void> {
    await super.print(log);
  }

  protected async sendLogs(logs: BatchedLog[]): Promise<void> {
    console.log('sendLogs')
    try {
      await axios.post(this._config.url, logs.map(log => log.log));
    } catch (error) {
      console.error('HTTP log error', error)
      const errorLogs = logs.map(log => ({ ...log, error }));
      this.emit('batch-error', errorLogs);
    }

    this.emit('batch-logged', logs);
  }
  //#endregion
}
