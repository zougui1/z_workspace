import { enumerateKeys } from '@zougui/utils';

import * as actions from './actions';
import * as services from './services';
import { DiscordBackupBotMachineConfig } from './types';
import { events } from './events';
import { version } from './version';
import { workflowName } from '../workflow-name';

enum states {
  initializing = 'initializing',
  idle = 'idle',
  running = 'running',
  downloadingServers = 'downloadingServers',
  writingToFileSystem = 'writingToFileSystem',
  compressing = 'compressing',
  moving = 'moving',
  success = 'success',
  failure = 'failure',
}

const serviceNames = enumerateKeys(services);
const actionNames = enumerateKeys(actions);

export const getBackupMachineConfig = (): DiscordBackupBotMachineConfig => {
  return {
    config: {
      id: workflowName,
      version,
      initial: states.initializing,

      states: {
        [states.initializing]: {
          on: {
            [events.INIT]: {
              target: states.idle,
              actions: actionNames.onInit,
            },
          },
        },
        [states.idle]: {
          on: {
            [events.START]: states.running,
            [events.MESSAGE_ADD]: states.running,
            [events.MESSAGE_UPDATE]: states.running,
            [events.MESSAGE_DELETE]: states.running,
          },
        },

        [states.running]: {
          invoke: {
            id: serviceNames.createDiscordBackup,
            src: (context) => services.createDiscordBackup(context.client, context.options),
            onDone: `#${workflowName}.${states.success}`,
            onError: `#${workflowName}.${states.failure}`,
          },
        },

        [states.success]: {
          // go to the `idle` state after a bit so that
          // the message set to the bot's activity can be seen
          after: {
            FINISH_DELAY: states.idle,
          },
        },
        [states.failure]: {
          entry: actionNames.onError,
          // go to the `idle` state after a bit so that
          // the message set to the bot's activity can be seen
          after: {
            FINISH_DELAY: states.idle,
          },
        },
      },
    },
    events: {},
    options: {
      actions: {
        ...(actions as any),
      },
      delays: {
        FINISH_DELAY: 5000,
      },
    },
  };
}
