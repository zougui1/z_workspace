import { QueryBuilderType, Model } from 'objection';

import { createHook, HookCategory, HookType } from './createHook';

const createBlockingHook = createHook(HookCategory.blocking);

export const BlockingBeforeInsert = createBlockingHook(HookType.beforeInsert);
export const BlockingAfterInsert = createBlockingHook(HookType.afterInsert);
export const BlockingBeforeUpdate = createBlockingHook(HookType.beforeUpdate);
export const BlockingAfterUpdate = createBlockingHook(HookType.afterUpdate);
export const BlockingBeforeDelete = createBlockingHook(HookType.beforeDelete);
export const BlockingAfterDelete = createBlockingHook(HookType.afterDelete);
export const BlockingBeforeFind = createBlockingHook(HookType.beforeFind);
export const BlockingAfterFind = createBlockingHook(HookType.afterFind);

const createNonBlockingHook = createHook(HookCategory.nonBlocking);

export const BeforeInsert = createNonBlockingHook(HookType.beforeInsert);
export const AfterInsert = createNonBlockingHook(HookType.afterInsert);
export const BeforeUpdate = createNonBlockingHook(HookType.beforeUpdate);
export const AfterUpdate = createNonBlockingHook(HookType.afterUpdate);
export const BeforeDelete = createNonBlockingHook(HookType.beforeDelete);
export const AfterDelete = createNonBlockingHook(HookType.afterDelete);
export const BeforeFind = createNonBlockingHook(HookType.beforeFind);
export const AfterFind = createNonBlockingHook(HookType.afterFind);
export const BeforeAnyQuery = createNonBlockingHook(HookType.beforeAnyQuery);
export const AfterAnyQuery = createNonBlockingHook(HookType.afterAnyQuery);

export const OnError = createNonBlockingHook<[Error, QueryBuilderType<Model>]>(HookType.onError);
