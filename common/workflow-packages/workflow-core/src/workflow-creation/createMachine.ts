import { createMachine as createXstateMachine, StateSchema, AnyEventObject, StateMachine } from 'xstate';
import { ValueOf } from 'type-fest';
import * as uuid from 'uuid';

import { StateMachineConfig, EventObject } from './types';

export const createMachine = <TContext, TStateSchema extends StateSchema<any>, TEvent extends EventObject = AnyEventObject>(config: StateMachineConfig<TContext, TStateSchema, TEvent>): StateMachine<TContext, any, ValueOf<TEvent>> => {
  const machineId = uuid.v4();
  const { context } = config.config
  const configContext = typeof context === 'function'
    ? () => ({ ...(context as () => TContext)(), machineId })
    : { ...(context || {}), machineId };

  const newConfig = {
    ...config,
    config: {
      ...config.config,
      context: configContext,
    },
  };

  return createXstateMachine(newConfig.config as any, newConfig.options);
}
