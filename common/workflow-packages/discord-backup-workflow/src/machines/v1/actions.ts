import { assign } from 'xstate';
import Discord from 'discord.js';

import { logger } from '@zougui/logger';
import { safelySetActivity } from '@zougui/discord';

import { events } from './events';
import { DiscordBackupTaskLog } from './logs';
import { DiscordBackupContext, DiscordBackupEvent, DiscordBackupInvokeEvent } from './types';

export const onInit = assign<DiscordBackupContext>(function onInit() {
  const discordBackupLogs = new DiscordBackupTaskLog({});
  logger.info(discordBackupLogs.start());

  return {
    taskId: discordBackupLogs.taskId,
    servers: [],
  };
});

export const init = assign<DiscordBackupContext, DiscordBackupEvent[events.INIT]>(function init(ctx, event) {
  return {
    client: event.payload.client,
    options: event.payload.options,
  };
});

export const downloadedServers = assign<DiscordBackupContext, DiscordBackupInvokeEvent['DOWNLOADED_SERVERS']>(function downloadedServers(ctx, event) {
  return {
    servers: event.data,
  };
});

export const onIdle = (client: Discord.Client) => {
  safelySetActivity(client.user);
}

export const onSuccess = (taskId: string, client: Discord.Client) => {
  safelySetActivity(client.user, 'Servers successfully backed-up.');

  const discordBackupLogs = new DiscordBackupTaskLog({}, taskId);
  logger.success(discordBackupLogs.success({}));
}

export const onError = assign<DiscordBackupContext, DiscordBackupInvokeEvent['ERROR']>(function onError(ctx, event) {
  const error = event.data;
  const discordBackupLogs = new DiscordBackupTaskLog({}, ctx.taskId);

  safelySetActivity(ctx.client.user, 'Couldn\'t back-up the servers.');
  logger.error(discordBackupLogs.error({ error }));

  return { error };
});
