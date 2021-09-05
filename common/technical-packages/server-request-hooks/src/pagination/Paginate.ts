import { Hook, HookDecorator } from '@foal/core';

import { validatePaginationQuery } from './validatePaginationQuery';

export const Paginate = (options: PaginateOptions = {}): HookDecorator => {
  return Hook(async ctx => {
    const { query } = ctx.request;
    const dirtyQuery = {
      page: query.page ?? options.defaultPage,
      pageSize: query.pageSize ?? query.limit ?? options.defaultPageSize
    };

    const validQuery = await validatePaginationQuery(dirtyQuery);

    ctx.request.query.page = validQuery.page;
    ctx.request.query.pageSize = validQuery.pageSize;
  });
}

export interface PaginateOptions {
  defaultPage?: number;
  defaultPageSize?: number;
}
