import { InterpreterOptions } from 'xstate';

import { interpret, replay, Interpreter, WorkflowEvent } from '@zougui/workflow-core';

import { getBackupMachineConfig } from './computer-backup-config-v1';
import { version } from './version';
import { events } from './events';
import { ComputerBackupContext, ComputerBackupEvent, ComputerBackupStateSchema } from './types';
import { workflowName } from '../workflow-name';

export const v1 = {
  name: workflowName,
  version,
  events,
  interpret: (options?: Partial<InterpreterOptions>): Interpreter<ComputerBackupContext, ComputerBackupStateSchema, ComputerBackupEvent> => {
    const config = getBackupMachineConfig();
    return interpret(config, options);
  },
  replay: (events: WorkflowEvent<ComputerBackupContext>[]): Interpreter<ComputerBackupContext, ComputerBackupStateSchema, ComputerBackupEvent> => {
    const config = getBackupMachineConfig();
    return replay(config, events);
  },
};
