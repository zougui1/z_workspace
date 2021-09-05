import { InterpreterOptions } from 'xstate';

import { interpret, replay, WorkflowEvent } from '@zougui/workflow-core';

import { getBackupMachineConfig } from './discord-backup-bot-config-v1';
import { version } from './version';
import { events } from './events';
import { DiscordBackupBotContext, DiscordBackupBotInterpreter } from './types';
import { workflowName } from '../workflow-name';

export const v1 = {
  name: workflowName,
  version,
  events,
  interpret: (options?: Partial<InterpreterOptions>): DiscordBackupBotInterpreter => {
    const config = getBackupMachineConfig();
    return interpret(config, options);
  },
  replay: (events: WorkflowEvent<DiscordBackupBotContext>[]): DiscordBackupBotInterpreter => {
    const config = getBackupMachineConfig();
    return replay(config, events);
  },
};
