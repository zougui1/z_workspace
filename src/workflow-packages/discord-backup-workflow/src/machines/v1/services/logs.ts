import { LogBuilder } from '@zougui/logger';
import env from '@zougui/env';
import { transactionContext } from '@zougui/transaction-context';

const scope = env.getScope(__filename);

export interface DownloadServerLogData {
  name: string;
}

export const DownloadServerLog = new LogBuilder<DownloadServerLogData>()
  .setCode('discord.servers.download.start')
  .setScope(scope)
  .setTransaction(transactionContext)
  .setTopics(['discord', 'bot'])
  .setMessage(({ data }) => `Downloading the server "${data.name}"`)
  .toClass();

export interface DownloadedServerLogData {
  name: string;
}

export const DownloadedServerLog = new LogBuilder<DownloadedServerLogData>()
  .setCode('discord.servers.download.success')
  .setScope(scope)
  .setTransaction(transactionContext)
  .setTopics(['discord', 'bot'])
  .setMessage(({ data }) => `Downloaded the server "${data.name}"`)
  .toClass();
