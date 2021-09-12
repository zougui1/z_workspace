import env from '@zougui/env';

export const USER_SERVER_HOST = env.get('USER_SERVER_HOST').required().asString();
