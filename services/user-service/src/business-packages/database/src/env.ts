import env from '@zougui/env';

export const DB_USER_CLIENT = env.get('DB_USER_CLIENT').required().asString();
export const DB_USER_HOST = env.get('DB_USER_HOST').required().asString();
export const DB_USER_PORT = env.get('DB_USER_PORT').required().asPortNumber();
export const DB_USER_USER = env.get('DB_USER_USER').required().asString();
export const DB_USER_PASSWORD = env.get('DB_USER_PASSWORD').required().asString();
export const DB_USER_DATABASE = env.get('DB_USER_DATABASE').required().asString();
export const DB_USER_POOL_MIN = env.get('DB_USER_POOL_MIN').asIntPositive();
export const DB_USER_POOL_MAX = env.get('DB_USER_POOL_MAX').asIntPositive();
export const DB_USER_DEBUG = env.get('DB_USER_DEBUG').asBool();
