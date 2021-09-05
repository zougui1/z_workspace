import {
  UseQueryResult as UseReactQueryResult,
  QueryObserverSuccessResult as ReactQueryObserverSuccessResult,
} from 'react-query';

import { HttpResponse } from '@zougui/http-core';
import { HttpServerResponse } from '@zougui/http-response-types';

/**
 * this override has for objective to simplify the use of queries by avoiding nested `data`
 *`query.data` comes from the library 'react-query' and contains the resulting data from the `queryFn`
 *`query.data.data` comes from the library 'axios' and is the response object of the HTTP request (for more info see: https://github.com/axios/axios#response-schema)
 *`query.data.data.data` comes from the "internal" API server that return an object containing a property 'data'; the actual data of the request
 *`query.data.data.metadata` comes from the "internal" API server that return an object containing a property 'metadata'; some "secondary" data of the request (like the total count of items)
 * @mutate this function mutates `query`
 */
export const overrideQueryObject = <TData = unknown, TMetadata extends Record<string, any> = any, TError = unknown>(query: UseReactQueryResult<TData, TError>): QueryResultOverride<TData, TMetadata, TError> => {
  // the override affects only when the query has succeeded
  if (query.status === 'success') {
    const anyQuery = query as unknown as ReactQueryObserverSuccessResult<HttpResponse<HttpServerResponse<TData>>, TError>;
    const successQuery = query as QuerySuccessResult<TData, TMetadata, TError>;

    successQuery.response = anyQuery.data;
    successQuery.metadata = anyQuery.data.data.metadata;
    // after that anything accessing `query.data` will in fact access `query.data.data.data`
    successQuery.data = anyQuery.data.data.data;
  }

  return query;
}

export interface QuerySuccessResult<TData = unknown, TMetadata extends Record<string, any> = any, TError = unknown> extends ReactQueryObserverSuccessResult<TData, TError> {
  response: HttpResponse<HttpServerResponse<TData, TMetadata>>;
  data: TData;
  metadata: TMetadata | undefined;
}

export type QueryResultOverride<TData = unknown, TMetadata extends Record<string, any> = any, TError = unknown> = UseReactQueryResult<TData, TError> | QuerySuccessResult<TData, TMetadata, TError>;
