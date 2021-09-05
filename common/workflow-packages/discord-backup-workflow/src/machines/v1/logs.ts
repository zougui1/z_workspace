import { TaskLogBuilder } from '@zougui/logger';
import { getErrorMessage } from '@zougui/error';

export const DiscordBackupTaskLog = new TaskLogBuilder()
  .setCode('discord.backup')
  .setVersion('1.0')
  .setTopics(['discord', 'backup'])
  .setMessages({
    start: 'Starting to back-up discord...',
    success: 'Discord has been successfully backed-up',
    error: ({ data }) => `An error occurred while backing-up discord: ${getErrorMessage(data.error)}`,
  })
  .toClass();
