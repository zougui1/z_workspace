import env from '@zougui/env';

export const APP_WORKSPACE = env.APP_WORKSPACE;
export const LOG_FILE_FORMAT = env.get('LOGGER_LOG_FILE_FORMAT').required().asString();
export const DATE_FORMAT = env.get('LOGGER_DATE_FORMAT').required().asString();
export const LOG_URL = env.get('LOG_API_ROUTE').required().asString();
export const BATCH_INTERVAL = env.get('LOGGER_BATCH_INTERVAL').required().asString();
export const BATCH_MIN = env.get('LOGGER_BATCH_MIN').required().asIntPositive();
export const BATCH_MAX = env.get('LOGGER_BATCH_MAX').required().asIntPositive();
export const DISABLE_HTTP = env.get('LOGGER_DISABLE_HTTP').default('false').asBool();
export const LOG_NAMESPACE = env.get('LOGGER_LOG_NAMESPACE').default('*').asString();
export const LOG_TOPICS = env.get('LOGGER_LOG_TOPICS').default('*').asArray();
export const LOG_LEVELS = env.get('LOGGER_LOG_LEVELS').default('*').asArray();
