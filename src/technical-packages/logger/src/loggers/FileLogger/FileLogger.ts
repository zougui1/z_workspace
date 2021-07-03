import path from 'path';

import fs from 'fs-extra';
import yaml from 'yaml';
import moment from 'moment';

import { extractErrors } from './extractErrors';
import { BaseLogger } from '../BaseLogger';
import { LoggerConfig, LoggerFileConfig } from '../../config';
import { ILog } from '../../log';

export class FileLogger extends BaseLogger<LoggerFileConfig> {

  private readonly _stream: fs.WriteStream;

  constructor(fullConfig: LoggerConfig, config: LoggerFileConfig) {
    super('console', fullConfig, config);

    fs.ensureDirSync(path.dirname(config.file));
    this._stream = fs.createWriteStream(config.file);
  }

  //#region logging
  protected print(log: ILog): Promise<void> {
    return new Promise((resolve, reject) => {
      log.data = extractErrors(log.data);
      log.time.createdAt = moment(log.time.createdAt).format(log.time.format);
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
