import path from 'path';

import fs from 'fs-extra';
import yaml from 'yaml';

import { ILog } from '@zougui/log-types';

import { BaseLogger } from '../BaseLogger';
import { LoggerConfig, LoggerFileConfig } from '../../config';
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
