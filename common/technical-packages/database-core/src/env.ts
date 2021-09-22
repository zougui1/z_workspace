import env from '@zougui/env';

export const LOG_SERVER = env.get('LOG_SERVER').required().asUrlString();
export const LOG_URL = `${LOG_SERVER}/api/v1/logs`;
export const QUERY_ID_NAME = '__queryId';
