import Discord from 'discord.js';

import { threadList } from '@zougui/thread-list';
import { logger } from '@zougui/logger';

import { LoginTimeoutError } from './errors';
import { BotLoggedInLog } from './logs';

export const createClient = (token: string, options: CreateClientOptions): Promise<Discord.Client> => {
  const client = new Discord.Client();
  threadList.addCleanup(() => client.destroy());

  return new Promise<Discord.Client>((resolve, reject) => {
    const handleLoginTimeout = setTimeout(() => {
      rejectError(new LoginTimeoutError({ timeout: options.timeout }));
    }, options.timeout);

    const cleanup = () => {
      client.off('ready', handleReady);
      client.off('error', handleError);
      clearTimeout(handleLoginTimeout);
    }

    const rejectError = (error: Error) => {
      cleanup();
      reject(error);
    }

    const handleReady = () => {
      cleanup();
      logger.info(new BotLoggedInLog({ botName: client.user?.username }));
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
