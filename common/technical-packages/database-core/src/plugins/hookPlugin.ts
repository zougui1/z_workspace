import { Model as ObjectionModel, QueryBuilderType, TransactionOrKnex, StaticHookArguments } from 'objection';
import * as uuid from 'uuid';

import { HookType } from '../decorators/hooks/createHook';
import { QUERY_ID_NAME } from '../env';

type HookList = ((arg: StaticHookArguments<any>) => any)[];

const executeHookList = async (hooks: HookList, args: any[]): Promise<void> => {
  const promises = hooks.map((hook: any) => hook(...args));
  await Promise.all(promises);
}

const executeHooks = async (constructor: any, type: HookType, args: any[]): Promise<void> => {
  const nonBlockingHooks = constructor.hooks?.nonBlocking?.[type] || [];
  executeHookList(nonBlockingHooks, args);

  const blockingHooks = constructor.hooks?.blocking?.[type] || [];
  await executeHookList(blockingHooks, args);
}

export const hookPlugin = <T extends typeof ObjectionModel>(Model: T): T => {
  return class HookPlugin extends (Model as typeof ObjectionModel) {
    static async beforeInsert(arg: StaticHookArguments<ObjectionModel>) {
      await super.beforeInsert(arg);
      await executeHooks(this, HookType.beforeInsert, [arg]);
      await executeHooks(this, HookType.beforeAnyQuery, [arg]);
    }

    static async afterInsert(arg: StaticHookArguments<ObjectionModel>) {
      await super.afterInsert(arg);
      await executeHooks(this, HookType.afterInsert, [arg]);
      await executeHooks(this, HookType.afterAnyQuery, [arg]);
    }

    static async beforeUpdate(arg: StaticHookArguments<ObjectionModel>) {
      await super.beforeUpdate(arg);
      await executeHooks(this, HookType.beforeUpdate, [arg]);
      await executeHooks(this, HookType.beforeAnyQuery, [arg]);
    }

    static async afterUpdate(arg: StaticHookArguments<ObjectionModel>) {
      await super.afterUpdate(arg);
      await executeHooks(this, HookType.afterUpdate, [arg]);
      await executeHooks(this, HookType.afterAnyQuery, [arg]);
    }

    static async beforeDelete(arg: StaticHookArguments<ObjectionModel>) {
      await super.beforeDelete(arg);
      await executeHooks(this, HookType.beforeDelete, [arg]);
      await executeHooks(this, HookType.beforeAnyQuery, [arg]);
    }

    static async afterDelete(arg: StaticHookArguments<ObjectionModel>) {
      await super.afterDelete(arg);
      await executeHooks(this, HookType.afterDelete, [arg]);
      await executeHooks(this, HookType.afterAnyQuery, [arg]);
    }

    static async beforeFind(arg: StaticHookArguments<ObjectionModel>) {
      await super.beforeFind(arg);
      await executeHooks(this, HookType.beforeFind, [arg]);
      await executeHooks(this, HookType.beforeAnyQuery, [arg]);
    }

    static async afterFind(arg: StaticHookArguments<ObjectionModel>) {
      await super.afterFind(arg);
      await executeHooks(this, HookType.afterFind, [arg]);
      await executeHooks(this, HookType.afterAnyQuery, [arg]);
    }

    static async onError(error: Error, queryBuilder: QueryBuilderType<ObjectionModel>) {
      await executeHooks(this, HookType.onError, [error, queryBuilder]);
    }

    static query<M extends ObjectionModel>(trxOrKnex?: TransactionOrKnex): QueryBuilderType<M> {
      const query = super.query(trxOrKnex);

      query.onError(async (error, queryBuilder) => {
        await this.onError(error, queryBuilder);
      });

      // adds a unique ID to the query builder
      // since the query builder gets cloned everytime it is used
      // we need to use its internal properties that will
      // get cloned BUT will clone ALL of its properties (e.g. Object.assign)
      // and not just a well defined set of known properties
      // like for the query builder
      if ((query as any)._context?.userContext) {
        (query as any)._context.userContext[QUERY_ID_NAME] = uuid.v4();
        (query as any)._context.userContext.queryBuilder = query;
      }

      return query as QueryBuilderType<M>;
    }
  } as any
}
