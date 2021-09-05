import nodemailer from 'nodemailer';

import { ILog } from '@zougui/log-types';

import { formatEmail } from './formatEmail';
import { BatchLogger, BatchedLog } from '../BatchLogger';
import { LoggerConfig, LoggerEmailConfig } from '../../config';

export class EmailLogger extends BatchLogger<LoggerEmailConfig> {

  private _nodemailer: typeof nodemailer = require('nodemailer');
  private _email: nodemailer.Transporter<nodemailer.SentMessageInfo>;

  constructor(fullConfig: LoggerConfig, config: LoggerEmailConfig) {
    super('email', fullConfig, config);

    this._email = this._nodemailer.createTransport({
      service: config.service,
      auth: {
        user: config.user,
        pass: config.password,
      },
    });
  }

  //#region logging
  protected async print(log: ILog): Promise<void> {
    await super.print(log);
  }

  protected async sendLogs(logs: BatchedLog[]): Promise<void> {
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
      const errorLogs = logs.map(log => ({ ...log, error }));
      this.emit('batch-error', errorLogs);
    }

    this.emit('batch-logged', logs);
  }
  //#endregion
}
