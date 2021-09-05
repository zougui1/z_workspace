import env from '@zougui/env';

export const APP_WORKSPACE = env.APP_WORKSPACE;
export const LOG_FILE_FORMAT = env.get('LOGGER_LOG_FILE_FORMAT').required().asString();
