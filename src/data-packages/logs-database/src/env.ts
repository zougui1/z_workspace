import env from '@zougui/env';

export const DB_LOGS_CLIENT = env.get('DB_LOGS_CLIENT').required().asString();
export const DB_LOGS_HOST = env.get('DB_LOGS_HOST').required().asString();
export const DB_LOGS_PORT = env.get('DB_LOGS_PORT').required().asPortNumber();
export const DB_LOGS_USER = env.get('DB_LOGS_USER').required().asString();
export const DB_LOGS_PASSWORD = env.get('DB_LOGS_PASSWORD').required().asString();
export const DB_LOGS_DATABASE = env.get('DB_LOGS_DATABASE').required().asString();
export const DB_LOGS_POOL_MIN = env.get('DB_LOGS_POOL_MIN').asIntPositive();
export const DB_LOGS_POOL_MAX = env.get('DB_LOGS_POOL_MAX').asIntPositive();
export const DB_LOGS_DEBUG = env.get('DB_LOGS_DEBUG').asBool();
