import Discord from 'discord.js';
import prettyMs from 'pretty-ms';
import { Exception } from '@zougui/error';
import { logger } from '@zougui/logger';

import { LoginErrorLog, BotLoggedInLog } from './logs';

export const createClient = (token: string, options: CreateClientOptions): Promise<Discord.Client> => {
  const client = new Discord.Client();

  return new Promise<Discord.Client>((resolve, reject) => {
    const handleLoginTimeout = setTimeout(() => {
      rejectError(new Exception(`Timeout, couldn't log within ${prettyMs(options.timeout)}.`, 'ERR_DISCORD_LOGIN_TIMEOUT'));
    }, options.timeout);

    const cleanup = () => {
      client.off('ready', handleReady);
      client.off('error', handleError);
      clearTimeout(handleLoginTimeout);
    }

    const rejectError = (error: Error) => {
      cleanup();
      logger.error(new LoginErrorLog({ error }));
      reject(error);
    }

    const handleReady = () => {
      cleanup();
      logger.info(new BotLoggedInLog({}));

      resolve(client);
    }

    const handleError = (error: Error) => {
      rejectError(error);
    }

    client.once('error', handleError);
    client.once('ready', handleReady);
    client.login(token);
  });
}

export interface CreateClientOptions {
  timeout: number;
}
