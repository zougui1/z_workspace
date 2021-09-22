import { Model, StaticHookArguments } from 'objection';

export enum HookCategory {
  blocking = 'blocking',
  nonBlocking = 'nonBlocking',
}

export enum HookType {
  beforeInsert = 'beforeInsert',
  afterInsert = 'afterInsert',
  beforeUpdate = 'beforeUpdate',
  afterUpdate = 'afterUpdate',
  beforeDelete = 'beforeDelete',
  afterDelete = 'afterDelete',
  beforeFind = 'beforeFind',
  afterFind = 'afterFind',
  beforeAnyQuery = 'beforeAnyQuery',
  afterAnyQuery = 'afterAnyQuery',
  onError = 'onError',
}

export const createHook = (category: HookCategory) => {
  return function createCategorizedHook<TArgs extends any[] = [StaticHookArguments<Model>]>(type: HookType) {
    return function createSpecificHook(hook: (...args: TArgs) => any) {
      return function HookDecorator(constructor: any) {
        constructor.hooks ??= {};
        constructor.hooks[category] ??= {};
        constructor.hooks[category][type] ??= [];
        constructor.hooks[category][type].push(hook);
      }
    }
  }
}
