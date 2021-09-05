import { InterpreterOptions } from 'xstate';

import { interpret, replay, Interpreter, WorkflowEvent } from '@zougui/workflow-core';

import { getBackupMachineConfig } from './discord-backup-config-v1';
import { version } from './version';
import { events } from './events';
import { DiscordBackupContext, DiscordBackupEvent, DiscordBackupStateSchema } from './types';
import { workflowName } from '../workflow-name';

export const v1 = {
  name: workflowName,
  version,
  events,
  interpret: (options?: Partial<InterpreterOptions>): Interpreter<DiscordBackupContext, DiscordBackupStateSchema, DiscordBackupEvent> => {
    const config = getBackupMachineConfig();
    return interpret(config, options);
  },
  replay: (events: WorkflowEvent<DiscordBackupContext>[]): Interpreter<DiscordBackupContext, DiscordBackupStateSchema, DiscordBackupEvent> => {
    const config = getBackupMachineConfig();
    return replay(config, events);
  },
};
