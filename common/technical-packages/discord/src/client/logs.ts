import { LogBuilder } from '@zougui/logger';
import { transactionContext } from '@zougui/transaction-context';

export interface SetUserActivityErrorLogData {
  bot: string;
  error: any;
}

export const SetUserActivityErrorLog = new LogBuilder<SetUserActivityErrorLogData>()
  .setCode('discord.bot.setActivity.error')
  .setVersion('1.0')
  .setTransaction(transactionContext)
  .setTopics(['discord', 'bot', 'activity'])
  .setMessage('Couldn\'t set the user activity.')
  .toClass();

export interface BotLoggedInLogData {
  botName?: string;
}

export const BotLoggedInLog = new LogBuilder<BotLoggedInLogData>()
  .setCode('discord.bot.login.success')
  .setVersion('1.0')
  .setTopics(['discord', 'bot', 'login'])
  .setMessage(({ data }) => data.botName ? `The bot "${data.botName}" logged in` : 'Unknown log-in')
  .toClass();
