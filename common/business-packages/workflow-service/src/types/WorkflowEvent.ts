import { StateValueMap } from 'xstate';

export interface WorkflowEvent {
  workflow: {
    name: string;
    version: string;
  };
  appName: string;
  state: {
    value: string | StateValueMap;
    context: Record<string, any> & { machineId: string };
  };
  event: Record<string, any> & { type: string; payload?: Record<string, any> };
}
