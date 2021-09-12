import { Hook, HookDecorator, HttpResponseUnauthorized, HttpResponseInternalServerError } from '@foal/core';
import axios from 'axios';

import { toFunction } from '@zougui/utils';

import { getUrl } from './getSignature';
import { USER_SERVER_HOST } from '../env';

export const UrlSignatureRequired = (options: UrlSignatureRequiredOptions): HookDecorator => {
  const getPort = toFunction(options.port);

  return Hook(async ctx => {
    const { expires, signature } = ctx.request.query;
    const { hostname, path } = ctx.request;

    const url = getUrl({
      path,
      port: getPort(),
      host: hostname,
    });

    try {
      // TODO move into a dedicated package
      await axios.get(`${USER_SERVER_HOST}/auth/check-signed-url`, {
        params: {
          url,
          expires,
          signature,
        },
      });
    } catch (error: any) {
      if (error?.response?.status === 401) {
        return new HttpResponseUnauthorized();
      }

      return new HttpResponseInternalServerError({ error });
    }
  });
}

export interface UrlSignatureRequiredOptions {
  port: number | (() => number);
}
