import { Log } from '@zougui/logger';

export interface BackupErrorLogData {
  error: any;
}

export const BackupErrorLog = new Log<BackupErrorLogData>()
  .setCode('discord.backup.error')
  .setTopics(['discord', 'backup'])
  .setMessage(({ data }) => `An error occured while trying to back-up discord:\n${data.error?.message ?? data.error ?? 'No error message provided.'}`)
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
  .setMessage(({ data }) => data.botName ? `The bot ${data.botName} logged in` : 'Unknown log-in')
  .toClass();
