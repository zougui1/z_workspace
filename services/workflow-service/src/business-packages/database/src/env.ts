import env from '@zougui/env';

export const DB_WORKFLOW_CLIENT = env.get('DB_WORKFLOW_CLIENT').required().asString();
export const DB_WORKFLOW_HOST = env.get('DB_WORKFLOW_HOST').required().asString();
export const DB_WORKFLOW_PORT = env.get('DB_WORKFLOW_PORT').required().asPortNumber();
export const DB_WORKFLOW_USER = env.get('DB_WORKFLOW_USER').required().asString();
export const DB_WORKFLOW_PASSWORD = env.get('DB_WORKFLOW_PASSWORD').required().asString();
export const DB_WORKFLOW_DATABASE = env.get('DB_WORKFLOW_DATABASE').required().asString();
export const DB_WORKFLOW_POOL_MIN = env.get('DB_WORKFLOW_POOL_MIN').asIntPositive();
export const DB_WORKFLOW_POOL_MAX = env.get('DB_WORKFLOW_POOL_MAX').asIntPositive();
export const DB_WORKFLOW_DEBUG = env.get('DB_WORKFLOW_DEBUG').asBool();
