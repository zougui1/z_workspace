import { Log } from '@zougui/logger';

export interface BrowseCategoryErrorLogData {
  server: {
    name: string;
  };
  category: {
    name: string;
  };
  error: any;
}

export const BrowseCategoryErrorLog = new Log<BrowseCategoryErrorLogData>()
  .setCode('discord.server.category.browse.error')
  .setTopics(['discord', 'bot', 'browse'])
  .setDiscordOptions(({ data }) => ({
    server: data.server.name,
    category: data.category.name,
    channel: 'logs',
    ensureChannel: true,
  }))
  .setMessage(({ data }) => `The following error occured: ${data.error.message}`)
  .toClass();

export interface LoginErrorLogData {
  error: Error;
}

export const LoginErrorLog = new Log<LoginErrorLogData>()
  .setCode('discord.bot.login.error')
  .setTopics(['discord', 'bot', 'login'])
  .setMessage(({ data }) => `The following error occured while trying to log-in: ${data.error.message}`)
  .toClass();

export interface BotLoggedInLogData {
  botName?: string;
}

export const BotLoggedInLog = new Log<BotLoggedInLogData>()
  .setCode('discord.bot.login.success')
  .setTopics(['discord', 'bot', 'login'])
  .setMessage(({ data }) => data.botName ? `The bot "${data.botName}" logged in` : 'Unknown log-in')
  .toClass();


export interface BotErrorLogData {
  error: any;
}

export const BotErrorLog = new Log<BotErrorLogData>()
  .setCode('discord.bot.error')
  .setTopics(['discord', 'bot'])
  .setMessage(({ data }) => `The following error occured: ${data.error?.message || data.error || 'Unknown error'}`)
  .toClass();
