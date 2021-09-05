import { LogBuilder } from '@zougui/logger';
import env from '@zougui/env';

const scope = env.getScope(__filename);

export interface BrowseCategoryErrorLogData {
  server: {
    name: string;
  };
  category: {
    name: string;
  };
  error: any;
}

export const BrowseCategoryErrorLog = new LogBuilder<BrowseCategoryErrorLogData>()
  .setCode('discord.server.category.browse.error')
  .setScope(scope)
  .setTopics(['discord', 'bot', 'browse'])
  .setOptions(({ data }) => ({
    discord: {
      server: data.server.name,
      category: data.category.name,
      channel: 'logs',
      ensureChannel: true,
    },
  }))
  .setMessage(({ data }) => `The following error occured: ${data.error.message}`)
  .toClass();

export interface BotErrorLogData {
  error: any;
}

export const BotErrorLog = new LogBuilder<BotErrorLogData>()
  .setCode('discord.bot.error')
  .setScope(scope)
  .setTopics(['discord', 'bot'])
  .setMessage(({ data }) => `The following error occured: ${data.error?.message || data.error || 'Unknown error'}`)
  .toClass();
