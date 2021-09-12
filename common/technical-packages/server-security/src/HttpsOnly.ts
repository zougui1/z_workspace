import { Hook, HookDecorator, HttpResponseForbidden } from '@foal/core';

import env from '@zougui/env';

export const HttpsOnly = (): HookDecorator => {
  return Hook(ctx => {
    // accept HTTP requests when in dev mode only
    if (!env.isDev && !ctx.request.secure) {
      return new HttpResponseForbidden();
    }
  });
}
