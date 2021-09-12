import env from '@zougui/env';

export const SECRET = env.get('JWT_SECRET').asString();
