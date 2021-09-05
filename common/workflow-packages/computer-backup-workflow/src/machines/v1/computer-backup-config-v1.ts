import { enumerateKeys } from '@zougui/utils';

import * as actions from './actions';
import * as services from './services';
import { version } from './version';
import { events } from './events';
import { ComputerBackupMachineConfig } from './types';
import { workflowName } from '../workflow-name';

enum states {
  idle = 'idle',
  running = 'running',
  filtering = 'filtering',
  copying = 'copying',
  compressing = 'compressing',
  logging = 'logging',
  moving = 'moving',
  success = 'success',
  failure = 'failure',
};

const serviceNames = enumerateKeys(services);
const actionNames = enumerateKeys(actions);

export const getBackupMachineConfig = (): ComputerBackupMachineConfig => {
  return {
    config: {
      id: workflowName,
      initial: states.idle,
      version,
      states: {
        [states.idle]: {
          on: {
            [events.START]: {
              target: states.running,
              actions: actionNames.start,
            },
          }
        },

        running: {
          initial: states.filtering,

          states: {
            [states.filtering]: {
              invoke: {
                id: serviceNames.filterInputs,
                src: (context) => services.filterInputs(context.sources),
                onDone: {
                  target: states.copying,
                  actions: actionNames.filteredSources,
                },
                onError: `#${workflowName}.${states.failure}`,
              },
            },

            [states.copying]: {
              invoke: {
                id: serviceNames.copyInputsToWorkspace,
                src: (context) => services.copyInputsToWorkspace(context.sources, context.originalSources, context.options),
                onDone: states.compressing,
                onError: `#${workflowName}.${states.failure}`,
              },
            },

            [states.compressing]: {
              invoke: {
                id: serviceNames.compressSources,
                src: (context) => services.compressSources(context.sources, context.options),
                onDone: states.logging,
                onError: `#${workflowName}.${states.failure}`,
              },
            },

            [states.logging]: {
              invoke: {
                id: serviceNames.createBackupLog,
                src: (context) => services.createBackupLog(context.sources, context.originalSources, context.options),
                onDone: states.moving,
                onError: `#${workflowName}.${states.failure}`,
              },
            },

            [states.moving]: {
              invoke: {
                id: serviceNames.moveBackup,
                src: (context) => services.moveBackup(context.options),
                onDone: `#${workflowName}.${states.success}`,
                onError: `#${workflowName}.${states.failure}`,
              },
            },
          },
        },

        [states.success]: {
          type: 'final',
        },
        [states.failure]: {
          type: 'final',
          entry: actionNames.error,
        },
      }
    },
    events,
    options: {
      actions: actions as any,
    },
  }
}
