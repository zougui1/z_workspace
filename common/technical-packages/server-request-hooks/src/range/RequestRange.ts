import { Hook, HookDecorator } from '@foal/core';

import { validateRangeQuery } from './validateRangeQuery';

export const RequestRange = (options: RequestRangeOptions = {}): HookDecorator => {
  return Hook(async ctx => {
    const { query } = ctx.request;
    const dirtyQuery = {
      skip: query.skip ?? options.defaultSkip,
      limit: query.limit ?? options.defaultLimit,
    };

    const validQuery = await validateRangeQuery(dirtyQuery);

    ctx.request.query.skip = validQuery.skip;
    ctx.request.query.limit = validQuery.limit;
  });
}

export interface RequestRangeOptions {
  defaultSkip?: number;
  defaultLimit?: number;
}
