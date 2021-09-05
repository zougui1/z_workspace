import prettyMs from 'pretty-ms';

import { Exception } from '@zougui/error';

export interface LoginTimeoutErrorData {
  timeout: number;
}

export const LoginTimeoutError = new Exception<LoginTimeoutErrorData>()
  .setCode('discord.login.timeout')
  .setMessage(data => `Timeout, couldn't log within ${prettyMs(data.timeout)}`)
  .setStatus(500)
  .toClass();
