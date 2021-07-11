import { assign } from 'xstate';
import Discord from 'discord.js';


import { safelySetActivity } from '@zougui/discord';

import { events } from './events';
import { DiscordBackupContext, DiscordBackupEvent, DiscordBackupInvokeEvent } from './types';

export const init = assign<DiscordBackupContext, DiscordBackupEvent[events.INIT]>({
  client: (ctx: DiscordBackupContext, event: DiscordBackupEvent[events.INIT]) => event.payload.client,
  servers: [],
});

export const start = assign<DiscordBackupContext, DiscordBackupEvent[events.START]>({
  options: (ctx: DiscordBackupContext, event: DiscordBackupEvent[events.START]) => event.payload.options,
});

export const downloadedServers = assign<DiscordBackupContext, DiscordBackupInvokeEvent['DOWNLOADED_SERVERS']>({
  servers: (ctx: DiscordBackupContext, event: DiscordBackupInvokeEvent['DOWNLOADED_SERVERS']) => event.data,
});

export const idleActivity = (client: Discord.Client) => {
  safelySetActivity(client.user);
}

export const successActivity = (client: Discord.Client) => {
  safelySetActivity(client.user, 'Servers successfully backed-up.');
}

export const errorActivity = (client: Discord.Client) => {
  safelySetActivity(client.user, 'Couldn\'t back-up the servers.');
}

export const error = assign<DiscordBackupContext, DiscordBackupInvokeEvent['ERROR']>({
  error: (ctx: DiscordBackupContext, event: DiscordBackupInvokeEvent['ERROR']) => event.data,
});
