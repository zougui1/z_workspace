import { HttpResponse } from '@zougui/http-core';
import { ILog } from '@zougui/log-types';

import { logHttp } from '../logHttp';
import { PaginationOptions } from '../types';

export const getLogs = async (options?: GetLogsOptions): Promise<HttpResponse<ILog[]>> => {
  return await logHttp.get('/api/v1/logs', {
    query: {
      ...(options?.query || {}),
      ...(options?.pagination || {}),
    },
  });
}

export interface GetLogsOptions {
  pagination?: PaginationOptions;
  query?: {
    transaction?: {
      id?: string;
    };
    task?: {
      id?: string;
    };
  };
}
