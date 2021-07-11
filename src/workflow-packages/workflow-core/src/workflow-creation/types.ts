import { MachineConfig, MachineOptions, AnyEventObject, StateSchema } from 'xstate';
import { ValueOf } from 'type-fest';

export type EventValue = { type: string; payload: Record<string, any> };
export type EventObject = Record<string, EventValue>;
export type InvokeEventValue = { type: string; data: any };
export type InvokeEventObject = Record<string, InvokeEventValue>;

export interface StateMachineConfig<TContext, TStateSchema extends StateSchema<any>, TEvent extends EventObject = AnyEventObject> {
  config: MachineConfig<TContext, TStateSchema, ValueOf<TEvent>> & { id: string; version: string; };
  options?: Partial<MachineOptions<TContext, ValueOf<TEvent>>>;
  events: Record<ValueOf<TEvent>['type'], string>;
}

export interface StateMachineContext {
  machineId: string;
}
