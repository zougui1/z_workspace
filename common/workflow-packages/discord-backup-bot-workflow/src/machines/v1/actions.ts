import { assign } from 'xstate';

import { events } from './events';
import { DiscordBackupBotContext, DiscordBackupBotEvent, DiscordBackupBotInvokeEvent } from './types';

export const onInit = assign<DiscordBackupBotContext, DiscordBackupBotEvent[events.INIT]>(function onInit(ctx, event) {
  return {
    client: event.payload.client,
    options: event.payload.options,
  };
});

export const onError = assign<DiscordBackupBotContext, DiscordBackupBotInvokeEvent['ERROR']>(function onError(ctx, event) {
  return {
    error: event.data,
  };
});
