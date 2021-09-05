import { StateValueMap } from 'xstate';

import { Model } from '@zougui/database-core';

import { connectOnce } from '../connect';

class WorkflowEvent<TContext extends (Record<string, any> & { machineId: string }) = any> extends Model {

  static jsonAttributes = ['workflow', 'state', 'event'];

  workflow!: Workflow;
  appName!: string;
  state!: State<TContext>
  event!: Record<string, any> & { type: string };
}

export const WorkflowEventModel = WorkflowEvent.connect(connectOnce);

export namespace WorkflowEventModel {
  export type Instance = InstanceType<typeof WorkflowEventModel>;
}

export interface Workflow {
  id: string;
  name: string;
  version: string;
}

export interface State<TContext extends (Record<string, any> & { machineId: string }) = any> {
  value: string | StateValueMap;
  context: TContext;
}
