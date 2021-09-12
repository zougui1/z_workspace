import env from '@zougui/env';

export const PORT = env.get('USER_SERVER_PORT').required().asPortNumber();
export const URL_SIGNATURE_KEY = env.get('URL_SIGNATURE_KEY').required().asString();
