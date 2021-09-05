import { StateMachineConfig, StateMachineContext, EventObject, InvokeEventObject } from '@zougui/workflow-core';

export interface BrowserEvent extends EventObject {
  /*[events.START]: {
    type: events.START;
    payload: {
      sources: Source[];
      options: BackupOptions;
    };
  };*/
}

export interface BrowserInvokeEvent extends InvokeEventObject {
  /*FILTERED_SOURCES: {
    type: string;
    data: Source[];
  };*/
  ERROR: {
    type: string;
    data: any;
  };
}

export interface BrowserStateSchema {
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

export interface BrowserContext extends StateMachineContext {
  /*originalSources: Source[];
  sources: Source[];
  options: BackupOptions;
  backup: {
    date: moment.Moment;
    dirFormat: string;
  };*/
  error?: any;
}

export type BrowserMachineConfig = StateMachineConfig<BrowserContext, BrowserStateSchema, BrowserEvent>;
