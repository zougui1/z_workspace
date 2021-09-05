import env from '@zougui/env';

export const DB_CLIENT = env.get('DB_CLIENT').required().asString();
export const DB_HOST = env.get('DB_HOST').required().asString();
export const DB_PORT = env.get('DB_PORT').required().asPortNumber();
export const DB_USER = env.get('DB_USER').required().asString();
export const DB_PASSWORD = env.get('DB_PASSWORD').required().asString();
export const DB_DATABASE = env.get('DB_DATABASE').required().asString();
export const DB_POOL_MIN = env.get('DB_POOL_MIN').asIntPositive();
export const DB_POOL_MAX = env.get('DB_POOL_MAX').asIntPositive();
export const DB_DEBUG = env.get('DB_DEBUG').asBool();
