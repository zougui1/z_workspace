import { createHttp } from '@zougui/http-core';

import { LOG_SERVER } from './env';

export const logHttp = createHttp({
  baseURL: LOG_SERVER,
});
