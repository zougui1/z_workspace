import env from '@zougui/env';

export const LOG_SERVER = env.get('LOG_SERVER').required().asString();
