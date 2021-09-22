import { Model, QueryBuilderType } from 'objection';

import { TaskLogBuilder } from '@zougui/logger';
import { LogLevel } from '@zougui/log-types';
import { getErrorMessage } from '@zougui/error';
import { mergeDecorators } from '@zougui/utils';

import { BeforeAnyQuery, AfterAnyQuery, OnError } from './hooks';
import { QUERY_ID_NAME } from '../../env';
import { logger } from '../../logger';

interface QueryLogData {
  queryId: string;
  method: string;
  options: any;
  timeout: boolean;
  cancelOnTimeout: boolean;
  bindings: any[];
  sql: string;
  query: string;
}

const QueryLog = new TaskLogBuilder<QueryLogData>()
  .setCode('database.query')
  .setTopics(['database', 'query'])
  .setSubNamespace('query')
  .setVersion('v1')
  .setMessages({
    start: ({ data }) => `Executing SQL query "${data.queryId}"...`,
    success: ({ data, level }) => level === LogLevel.debug
      ? `Successfully Executed SQL query "${data.queryId}": "${data.query}"`
      : `Successfully Executed SQL query "${data.queryId}".`,
    error: ({ data }) => `Failed to execute SQL query "${data.queryId}": ${getErrorMessage(data.error)}`,
  })
  .toClass();

const getQueryData = (queryBuilder: QueryBuilderType<Model>): QueryLogData => {
  const knexQuery = queryBuilder.toKnexQuery();

  const sqlQuery = {
    queryId: (queryBuilder as any)._context?.userContext?.[QUERY_ID_NAME],
    ...knexQuery.toSQL(),
    query: knexQuery.toQuery(),
  };

  return sqlQuery as any;
}

export const Log = () => {
  return mergeDecorators(
    BeforeAnyQuery(async arg => {
      const { queryBuilder } = arg.context as any;

      if (!queryBuilder) {
        return;
      }

      const sqlQuery = getQueryData(queryBuilder);
      const queryLogs = new QueryLog(sqlQuery as any, sqlQuery.queryId);

      logger.info(queryLogs.start());
    }),
    AfterAnyQuery(async arg => {
      const { queryBuilder } = arg.context as any;

      if (!queryBuilder) {
        return;
      }

      const sqlQuery = getQueryData(queryBuilder);
      const queryLogs = new QueryLog(sqlQuery as any, sqlQuery.queryId);

      logger.oneOf([LogLevel.info, LogLevel.debug], queryLogs.success({}));
    }),
    OnError(async (error, queryBuilder) => {
      const sqlQuery = getQueryData(queryBuilder);
      const queryLogs = new QueryLog(sqlQuery as any, sqlQuery.queryId);

      logger.error(queryLogs.error({ error }));
    }),
  );
}
