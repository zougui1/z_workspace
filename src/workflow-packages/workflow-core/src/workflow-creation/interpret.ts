import {
  interpret as interpretXstateMachine,
  StateSchema,
  AnyEventObject,
  Interpreter as XstateInterpreter,
  StateValueMap,
  InterpreterOptions,
  State,
  DoneEventObject,
} from 'xstate';
import { ValueOf } from 'type-fest';

import { createMachine } from './createMachine';
import { StateMachineConfig, EventObject, EventValue } from './types';

export const interpret = <TContext, TStateSchema extends StateSchema<any>, TEvent extends EventObject = AnyEventObject>(workflow: StateMachineConfig<TContext, TStateSchema, TEvent>, options?: Partial<InterpreterOptions>): Interpreter<TContext, TStateSchema, TEvent> => {
  const workflowName = workflow.config.id;
  const workflowVersion = workflow.config.version;
  const machine = createMachine(workflow);
  const service = interpretXstateMachine(machine, options);

  const serviceOnEvent = service.onEvent.bind(service);
  const serviceOnDone = service.onDone.bind(service);
  const serviceSend = service.send.bind(service);
  const interpretationService = service as unknown as Interpreter<TContext, TStateSchema, TEvent>;

  interpretationService.onEvent = (listener: (data: EventData<TContext>) => void): Interpreter<TContext, TStateSchema, TEvent> => {
    serviceOnEvent((event) => {
      const { value, context } = service.state;

      listener({
        workflow: {
          name: workflowName,
          version: workflowVersion,
        },
        state: {
          value,
          context,
        },
        event: event as EventValue,
      });
    });

    return interpretationService;
  }

  interpretationService.waitDone = (): Promise<{ state: string | StateValueMap; data: TContext; event: DoneEventObject; }> => {
    return new Promise(resolve => {
      serviceOnDone(event => {
        const { value, context } = service.state;
        resolve({ state: value, data: context, event });
      });
    });
  }

  interpretationService.setOption = <K extends keyof InterpreterOptions>(key: K, value: InterpreterOptions[K]): Interpreter<TContext, TStateSchema, TEvent> => {
    // `service.options` is readonly so it needs to be set without the readonly
    const serviceOptions: InterpreterOptions = service.options;
    serviceOptions[key] = value;
    return interpretationService;
  }

  interpretationService.send = <TEventType extends keyof TEvent>(event: TEventType, payload: TEvent[TEventType]['payload']): State<TContext, ValueOf<TEvent>, TStateSchema, any> => {
    return serviceSend(event as ValueOf<TEvent>['type'], { payload });
  }

  return interpretationService;
}

export interface Interpreter<TContext, TStateSchema extends StateSchema<any>, TEvent extends EventObject = AnyEventObject> extends Omit<XstateInterpreter<TContext, any, ValueOf<TEvent>>, 'onEvent' | 'send' | 'start'> {
  onEvent: (listener: (data: EventData<TContext>) => void) => this;
  waitDone: () => Promise<{
    state: string | StateValueMap;
    data: TContext;
    event: DoneEventObject;
  }>;
  setOption: <K extends keyof InterpreterOptions>(key: K, value: InterpreterOptions[K]) => this;
  start: () => this;
  send: <TEventType extends keyof TEvent>(event: TEventType, payload: TEvent[TEventType]['payload']) => State<TContext, ValueOf<TEvent>, TStateSchema, any>;
}

export interface EventData<TContext> {
  workflow: {
    name: string;
    version: string;
  };
  state: {
    value: string | StateValueMap;
    context: TContext;
  };
  event: ValueOf<EventObject>;
}
