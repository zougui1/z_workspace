import fs from 'fs-extra';
import yaml from 'yaml';
import path from 'path';
import * as uuid from 'uuid';
import moment from 'moment';

import { BaseTransportLogger } from '../BaseTransportLogger';
import { extractError } from '../extractError';
import { ILoggerOptions } from '../types';
import { LogLevel } from '../LogLevel';
import { ILogObject } from '../log-utils/LogV2';
import { FileLogConfig } from '../types/logger-config-types';

export class FileLogger extends BaseTransportLogger<FileLogConfig> {

  private readonly _stream: fs.WriteStream;

  constructor(config: FileLogConfig, options: ILoggerOptions & { logFile: string }) {
    super(config, {
      ...options,
      name: 'file',
    });

    fs.ensureDirSync(path.dirname(options.logFile));
    this._stream = fs.createWriteStream(options.logFile);
  }

  //#region logging
  protected print(level: LogLevel, log: ILogObject, logId: string): Promise<void> {
    return new Promise(resolve => {
      const message = this.formatLog(level, log);
      const written = this._stream.write(yaml.stringify(message));

      const done = () => {
        this.emit('logged', logId);
        resolve();
      }

      if (written) {
        process.nextTick(done);
      } else {
        this._stream.once('drain', done);
      }
    });
  }
  //#endregion

  //#region helpers
  protected formatLog(level: LogLevel, log: ILogObject): any {
    const message = log.getMessage();
    const time = log.getTime();

    const logData: any = {
      id: uuid.v4(),
      level,
      message,
      code: log.code ?? 'code.unknown',
      topics: log.topics,
    };

    if (log.profile) {
      logData.profile = log.profile;
    }

    logData.time = {
      ...time,
      createdAt: moment(time.createdAt).format(time.format),
    };
    logData.data = { ...log.data } ?? {};
    logData.context = log.getContext();

    for (const key in logData.data) {
      if (Object.prototype.hasOwnProperty.call(logData.data, key)) {
        const element = logData.data[key];

        if (element instanceof Error) {
          logData.data[key] = extractError(element);
        }
      }
    }

    if (this._options.metadata) {
      logData.metadata = this._options.metadata;
    }

    return logData;
  }
  //#endregion
}
