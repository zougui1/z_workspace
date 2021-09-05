import {
  StateSchema,
  AnyEventObject,
  StateValueMap,
} from 'xstate';

import { interpret, Interpreter } from './interpret';
import { StateMachineConfig, EventObject } from './types';

/**
 * replay all the events until the last one without executing anything
 * and then replay the last event with execution enabled
 */
export const replay = <TContext extends (Record<string, any> & { machineId: string }), TStateSchema extends StateSchema<any>, TEvent extends EventObject = AnyEventObject>(workflow: StateMachineConfig<TContext, TStateSchema, TEvent>, events: WorkflowEvent<TContext>[]): Interpreter<TContext, TStateSchema, TEvent> => {
  const playableEvents = events.filter(e => e.event.type !== 'xstate.init');

  const service = interpret(workflow, { execute: false });
  const serviceStart = service.start.bind(service);
  const playEvent = (event: WorkflowEvent<TContext>): void => {
    service.state.context = event.state.context;
    service.send(event.event.type, event.event.payload);
  }

  service.start = (): Interpreter<TContext, TStateSchema, TEvent> => {
    serviceStart();

    for (const event of playableEvents.slice(0, -1)) {
      playEvent(event);
    }

    service.setOption('execute', true);
    const lastEvent = playableEvents[playableEvents.length - 1];

    if (lastEvent) {
      playEvent(lastEvent);
    }

    return service;
  }

  return service;
}

export interface WorkflowEvent<TContext extends (Record<string, any> & { machineId: string }) = any> {
  state: {
    value: string | StateValueMap;
    context: TContext;
  };
  event: Record<string, any> & { type: string; payload: Record<string, any> };
}
