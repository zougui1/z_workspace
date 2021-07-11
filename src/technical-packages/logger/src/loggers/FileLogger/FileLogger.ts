import path from 'path';

import fs from 'fs-extra';
import yaml from 'yaml';
import moment from 'moment';

import { BaseLogger } from '../BaseLogger';
import { LoggerConfig, LoggerFileConfig } from '../../config';
import { ILog } from '../../log';
import { getLogFile, extractErrors } from '../../utils';

export class FileLogger extends BaseLogger<LoggerFileConfig> {

  private _fs: typeof fs = require('fs-extra');
  private readonly _stream: fs.WriteStream;

  constructor(fullConfig: LoggerConfig, config: LoggerFileConfig) {
    super('console', fullConfig, config);

    const file = getLogFile(fullConfig) as string;

    this._fs.ensureDirSync(path.dirname(file));
    this._stream = this._fs.createWriteStream(file);
  }

  //#region logging
  protected print(log: ILog): Promise<void> {
    return new Promise((resolve, reject) => {
      log.data = extractErrors(log.data);
      log.time.createdAt = moment(log.time.createdAt).format(log.time.format);

      if (log.transaction?.time.startedAt) {
        log.transaction.time.startedAt= moment(log.transaction.time.startedAt).format(log.time.format);
      }
      if (log.transaction?.time.finishedAt) {
        log.transaction.time.finishedAt= moment(log.transaction.time.finishedAt).format(log.time.format);
      }

      const written = this._stream.write(yaml.stringify(log));

      const cleanup = () => {
        this.emit('logged', log.logId);
        this._stream.off('drain', onResolve);
        this._stream.off('error', onReject);
      }

      const onResolve = () => {
        cleanup();
        resolve();
      }
      const onReject = () => {
        cleanup();
        reject();
      }

      if (written) {
        process.nextTick(onResolve);
      } else {
        this._stream.once('drain', onResolve);
        this._stream.once('error', onReject);
      }
    });
  }
  //#endregion
}
