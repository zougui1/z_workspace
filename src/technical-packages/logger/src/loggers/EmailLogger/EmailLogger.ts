import nodemailer from 'nodemailer';
import moment from 'moment';

import { formatEmail } from './formatEmail';
import { BaseLogger } from '../BaseLogger';
import { LoggerConfig, LoggerEmailConfig } from '../../config';
import { ILog } from '../../log';

export class EmailLogger extends BaseLogger<LoggerEmailConfig> {

  private _email: nodemailer.Transporter<nodemailer.SentMessageInfo>;
  private _logs: Record<string, { log: ILog; callback: (err?: any) => void }> = {};

  constructor(fullConfig: LoggerConfig, config: LoggerEmailConfig) {
    super('email', fullConfig, config);

    this._email = nodemailer.createTransport({
      service: config.service,
      auth: {
        user: config.user,
        pass: config.password,
      },
    });
    this.init();
  }

  //#region logging
  protected async print(log: ILog): Promise<void> {
    log.time.createdAt = moment(log.time.createdAt).format(log.time.format);

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
    const subject = `Logger/${logs[0]?.log.context.app.name} (${logs.length} logs):`;

    const email = {
      from: this._config.user,
      to: this._config.to,
      subject,
      html: formatEmail(logs.map(log => log.log), subject),
    };

    try {
      await new Promise<void>((resolve, reject) => {
        this._email.sendMail(email, (error) => {
          if (error) return reject(error);
          resolve();
        });
      });
    } catch (error) {
      for (const { callback } of logs) {
        callback(error);
      }
    }

    for (const { log, callback } of logs) {
      this.emit('logged', log.logId);
      delete this._logs[log.logId];
      callback();
    }
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
