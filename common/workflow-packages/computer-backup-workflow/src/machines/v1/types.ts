import { StateMachineConfig, StateMachineContext, EventObject, InvokeEventObject } from '@zougui/workflow-core';

import { events } from './events';
import { Source, BackupOptions } from './services';

export interface ComputerBackupEvent extends EventObject {
  [events.START]: {
    type: events.START;
    payload: {
      sources: Source[];
      options: BackupOptions;
    };
  };
}

export interface ComputerBackupInvokeEvent extends InvokeEventObject {
  FILTERED_SOURCES: {
    type: string;
    data: Source[];
  };
  ERROR: {
    type: string;
    data: any;
  };
}

export interface ComputerBackupStateSchema {
  states: {
    idle: {};

    running: {
      states: {
        filtering: {};
        copying: {};
        compressing: {};
        logging: {};
        moving: {};
      };
    };

    success: {};
    failure: {};
  };
}

export interface ComputerBackupContext extends StateMachineContext {
  originalSources: Source[];
  sources: Source[];
  options: BackupOptions;
  backup: {
    date: moment.Moment;
    dirFormat: string;
  };
  error?: any;
}

export type ComputerBackupMachineConfig = StateMachineConfig<ComputerBackupContext, ComputerBackupStateSchema, ComputerBackupEvent>;
