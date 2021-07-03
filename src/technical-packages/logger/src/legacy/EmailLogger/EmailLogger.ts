import nodemailer from 'nodemailer';
import ProtonMail from 'protonmail-api';

import { formatEmail } from './formatEmail';
import { BaseTransportLogger } from '../BaseTransportLogger';
import { ILoggerOptions } from '../types';
import { LogLevel } from '../LogLevel';
import { ILogObject } from '../log-utils/LogV2';
import { EmailLogConfig } from '../types/logger-config-types';

export class EmailLogger extends BaseTransportLogger<EmailLogConfig> {

  private _transport: nodemailer.Transporter<nodemailer.SentMessageInfo> | undefined;

  constructor(config: EmailLogConfig, options: ILoggerOptions = {}) {
    super(config, { ...options, name: 'email' });

    if (this._config.service === 'protonmail') {
      ProtonMail.connect({
        username: config.user,
        password: config.password,
      })
        .then((protonMail: any) => this._transport = protonMail)
        .catch((err: any) => console.error('could not connect to protonmail:', err));
    } else {
      this._transport = nodemailer.createTransport({
        service: this._config.service,
        auth: {
          user: config.user,
          pass: config.password,
        },
      });
    }
  }

  //#region logging
  protected async print(level: LogLevel, log: ILogObject, logId: string): Promise<void> {
    const email = {
      from: this._config.user,
      to: this._config.to,
      subject: `Backup: ${level}`,
      html: formatEmail(level, log, { logger: this._options, config: this._config }),
    };

    if (!this._transport) {
      this.emit('logged', logId);
      return;
    }

    if (this._config.service === 'protonmail') {
      try {
        await this._transport.sendMail(email);
        console.log('email sent')
      } catch (error) {
        console.error('Failed to log to email', error);
      } finally {
        this.emit('logged', logId);
      }
    } else {
      this._transport.sendMail(email, (error) => {
        if (error) {
          console.error('Failed to log to email', error);
        }

        this.emit('logged', logId);
      });
    }
  }
  //#endregion
}
