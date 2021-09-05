import { MergeHooks, HookDecorator } from '@foal/core';

import { RequestRange, RequestRangeOptions } from './range';
import { Paginate, PaginateOptions } from './pagination';

export const PaginatedRequest = (options: PaginatedRequest = {}): HookDecorator => {
  return MergeHooks(
    RequestRange({
      defaultLimit: options.defaultLimit,
      defaultSkip: options.defaultSkip,
    }),
    Paginate({
      defaultPage: options.defaultPage,
      defaultPageSize: options.defaultPageSize,
    }),
  );
}

export interface PaginatedRequest extends RequestRangeOptions, PaginateOptions {}
