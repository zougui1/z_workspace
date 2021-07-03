import { HttpResponse } from '@foal/core';

export const setCors = <T extends HttpResponse>(response: T): T => {
  return response
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', '*')
    .setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization')
    .setHeader('Access-Control-Allow-Credentials', 'true');
}
