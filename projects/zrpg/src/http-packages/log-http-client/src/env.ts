import env from '@zougui/env';

export const LOG_SERVER_HOST = env.get('LOG_SERVER_HOST').required().asString();
