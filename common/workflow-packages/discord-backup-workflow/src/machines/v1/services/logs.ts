import { TaskLogBuilder } from '@zougui/logger';
import { transactionContext } from '@zougui/transaction-context';

export interface DownloadServerTaskLogData {
  name: string;
}

export const DownloadServerTaskLog = new TaskLogBuilder<DownloadServerTaskLogData>()
  .setCode('discord.servers.download')
  .setVersion('1.0')
  .setTransaction(transactionContext)
  .setTopics(['discord', 'bot'])
  .setMessages({
    start: ({ data }) => `Downloading the server "${data.name}"`,
    success: ({ data }) => `Downloaded the server "${data.name}"`,
    error: ({ data }) => `Couldn't download the server "${data.name}"`,
  })
  .toClass();
