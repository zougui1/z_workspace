import { assign } from 'xstate';

import { events } from './events';
import { ComputerBackupContext, ComputerBackupEvent, ComputerBackupInvokeEvent } from './types';

export const start = assign<ComputerBackupContext, ComputerBackupEvent[events.START]>({
  originalSources: (ctx: ComputerBackupContext, event: ComputerBackupEvent[events.START]) => event.payload.sources,
  sources: (ctx: ComputerBackupContext, event: ComputerBackupEvent[events.START]) => event.payload.sources,
  options: (ctx: ComputerBackupContext, event: ComputerBackupEvent[events.START]) => event.payload.options,
});

export const filteredSources = assign<ComputerBackupContext, ComputerBackupInvokeEvent['FILTERED_SOURCES']>({
  sources: (ctx: ComputerBackupContext, event: ComputerBackupInvokeEvent['FILTERED_SOURCES']) => event.data,
});

export const error = assign<ComputerBackupContext, ComputerBackupInvokeEvent['ERROR']>({
  error: (ctx: ComputerBackupContext, event: ComputerBackupInvokeEvent['ERROR']) => event.data,
});
