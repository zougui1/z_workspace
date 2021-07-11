import { enumerateKeys } from '@zougui/utils';

import * as actions from './actions';
import * as services from './services';
import { DiscordBackupMachineConfig } from './types';
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

export const getBackupMachineConfig = (): DiscordBackupMachineConfig => {
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
              actions: actionNames.init,
            },
          },
        },
        [states.idle]: {
          entry: actionNames.idleActivity,
          on: {
            [events.START]: {
              target: states.running,
              actions: actionNames.start,
            },
            [events.MESSAGE_ADD]: {
              target: states.running,
              actions: actionNames.start,
            },
            [events.MESSAGE_UPDATE]: {
              target: states.running,
              actions: actionNames.start,
            },
            [events.MESSAGE_DELETE]: {
              target: states.running,
              actions: actionNames.start,
            },
          },
        },

        [states.running]: {
          initial: states.downloadingServers,

          states: {
            [states.downloadingServers]: {
              invoke: {
                id: serviceNames.downloadDiscordServers,
                src: (context) => services.downloadDiscordServers(context.client),
                onDone: {
                  target: states.writingToFileSystem,
                  actions: actionNames.downloadedServers,
                },
                onError: `#${workflowName}.${states.failure}`,
              },
            },

            [states.writingToFileSystem]: {
              invoke: {
                id: serviceNames.writeDiscordServersToFileSystem,
                src: (context) => services.writeDiscordServersToFileSystem(context.client, context.servers, context.options),
                onDone: states.compressing,
                onError: `#${workflowName}.${states.failure}`,
              },
            },

            [states.compressing]: {
              invoke: {
                id: serviceNames.compressDiscordServers,
                src: (context) => services.compressDiscordServers(context.client, context.servers, context.options),
                onDone: states.moving,
                onError: `#${workflowName}.${states.failure}`,
              },
            },

            [states.moving]: {
              invoke: {
                id: serviceNames.moveDiscordServers,
                src: (context) => services.moveDiscordServers(context.client, context.options),
                onDone: `#${workflowName}.${states.success}`,
                onError: `#${workflowName}.${states.failure}`,
              },
            },
          },
        },

        [states.success]: {
          entry: actionNames.successActivity,
          // go to the `idle` state after a bit so that
          // the message set to the bot's activity can be seen
          after: {
            FINISH_DELAY: states.idle,
          },
        },
        [states.failure]: {
          entry: [actionNames.error, actionNames.errorActivity],
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
        [actionNames.idleActivity]: (context) => actions.idleActivity(context.client),
        [actionNames.successActivity]: (context) => actions.successActivity(context.client),
        [actionNames.errorActivity]: (context) => actions.errorActivity(context.client),
      },
      delays: {
        FINISH_DELAY: 5000,
      },
    },
  };
}
