import { StateValueMap } from 'xstate';

import { Model, Table, Log } from '@zougui/database-core';

import { connectOnce } from '../connect';

@Table(connectOnce)
@Log()
export class WorkflowEventModel<TContext extends (Record<string, any> & { machineId: string }) = any> extends Model {

  static jsonAttributes = ['workflow', 'state', 'event'];

  workflow!: Workflow;
  appName!: string;
  state!: State<TContext>
  event!: Record<string, any> & { type: string };
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
