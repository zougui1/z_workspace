import env from '@zougui/env';

export const PORT = env.get('FILE_SERVER_PORT').required().asPortNumber();
export const HASH_TIME = env.get('FILE_STORAGE_HASH_TIME').required().asString();
export const EXTRA_SALT_LEFT = env.get('FILE_STORAGE_EXTRA_SALT_LEFT').required().asString();
export const EXTRA_SALT_RIGHT = env.get('FILE_STORAGE_EXTRA_SALT_RIGHT').required().asString();
export const FILE_STORAGE_DIR = env.get('FILE_STORAGE_DIR').required().asString();
