import { LogBuilder } from '@zougui/logger';
import env from '@zougui/env';
import { transactionContext } from '@zougui/transaction-context';

const scope = env.getScope(__filename);

export interface SetUserActivityErrorLogData {
  bot: string;
  error: any;
}

export const SetUserActivityErrorLog = new LogBuilder<SetUserActivityErrorLogData>()
  .setCode('discord.bot.setActivity.error')
  .setScope(scope)
  .setTransaction(transactionContext)
  .setTopics(['discord', 'bot', 'activity'])
  .setMessage('Couldn\'t set the user activity.')
  .toClass();

export interface BotLoggedInLogData {
  botName?: string;
}

export const BotLoggedInLog = new LogBuilder<BotLoggedInLogData>()
  .setCode('discord.bot.login.success')
  .setScope(scope)
  .setTopics(['discord', 'bot', 'login'])
  .setMessage(({ data }) => data.botName ? `The bot "${data.botName}" logged in` : 'Unknown log-in')
  .toClass();
