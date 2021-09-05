import {
  useQuery as useReactQuery,
  QueryFunction,
  UseQueryOptions,
  QueryKey,
} from 'react-query';

import { HttpResponse } from '@zougui/http-core';
import { HttpServerResponse } from '@zougui/http-response-types';

import { overrideQueryObject, QueryResultOverride } from './overrideQueryObject';

export const useQuery = <TData = unknown, TMetadata extends Record<string, any> = any, TError = unknown, TQueryKey extends QueryKey = QueryKey>(queryKey: TQueryKey, queryFn: QueryFunction<HttpResponse<HttpServerResponse<TData>>, TQueryKey>, options?: UseQueryOptions<HttpResponse<HttpServerResponse<TData>>, TError, TData, TQueryKey>): QueryResultOverride<TData, TMetadata, TError> => {
  const query = useReactQuery(queryKey, queryFn, options);

  overrideQueryObject(query);

  return query;
}
