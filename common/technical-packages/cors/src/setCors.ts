import { HttpResponse } from '@foal/core';

import { CorsOptions } from './types';

const defaultAccessControlAllowOrigin = '*';
const defaultAccessControlAllowMethods = 'HEAD, GET, POST, PUT, PATCH, DELETE';
const defaultAccessControlAllowHeaders = 'Origin, Content-Type, Accept, Authorization'

export const setCors = <T extends HttpResponse>(response: T, options?: CorsOptions): T => {
  const accessControlAllowOrigin = typeof options === 'string'
    ? options
    : options?.AccessControlAllowOrigin ?? defaultAccessControlAllowOrigin;
  const accessControlAllowMethods = typeof options === 'string'
    ? options
    : options?.AccessControlAllowMethods ?? defaultAccessControlAllowMethods;
  const accessControlAllowHeaders = typeof options === 'string'
    ? options
    : options?.AccessControlAllowHeaders ?? defaultAccessControlAllowHeaders;

  return response
    .setHeader('Access-Control-Allow-Origin', accessControlAllowOrigin)
    .setHeader('Access-Control-Allow-Methods', accessControlAllowMethods)
    .setHeader('Access-Control-Allow-Headers', accessControlAllowHeaders)
    .setHeader('Access-Control-Allow-Credentials', 'true');
}
