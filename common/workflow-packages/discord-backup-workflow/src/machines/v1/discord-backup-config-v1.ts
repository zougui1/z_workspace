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
const failureState = `#${workflowName}.${states.failure}`;

export const getBackupMachineConfig = (): DiscordBackupMachineConfig => {

  return {
    config: {
      id: workflowName,
      version,
      initial: states.initializing,

      states: {
        [states.initializing]: {
          entry: actionNames.onInit,

          on: {
            [events.INIT]: {
              target: states.idle,
              actions: actionNames.init,
            },
          },
        },
        [states.idle]: {
          entry: actionNames.onIdle,
          on: {
            [events.START]: states.running,
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
                onError: failureState,
              },
            },

            [states.writingToFileSystem]: {
              invoke: {
                id: serviceNames.writeDiscordServersToFileSystem,
                src: (context) => services.writeDiscordServersToFileSystem(context.client, context.servers, context.options),
                onDone: states.compressing,
                onError: failureState,
              },
            },

            [states.compressing]: {
              invoke: {
                id: serviceNames.compressDiscordServers,
                src: (context) => services.compressDiscordServers(context.client, context.servers, context.options),
                onDone: states.moving,
                onError: failureState,
              },
            },

            [states.moving]: {
              invoke: {
                id: serviceNames.moveDiscordServers,
                src: (context) => services.moveDiscordServers(context.client, context.options),
                onDone: `#${workflowName}.${states.success}`,
                onError: failureState,
              },
            },
          },
        },

        [states.success]: {
          type: 'final',
          entry: actionNames.onSuccess,
        },
        [states.failure]: {
          type: 'final',
          entry: actionNames.onError,
        },
      },
    },
    events: {},
    options: {
      actions: {
        [actionNames.onInit]: actions.onInit,
        [actionNames.init]: actions.init as any,
        [actionNames.onIdle]: (context) => actions.onIdle(context.client),
        [actionNames.downloadedServers]: actions.downloadedServers,
        [actionNames.onSuccess]: (context) => actions.onSuccess(context.taskId, context.client),
        [actionNames.onError]: actions.onError,
      },
    },
  };
}
