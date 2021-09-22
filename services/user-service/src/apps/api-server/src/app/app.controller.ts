import { controller, IAppController, Context, HttpResponse, HttpResponseOK, Hook, isHttpResponse } from '@foal/core';

import { Cors } from '@zougui/cors';
import { resolveHttpErrorResponse } from '@zougui/http-error';

import { V1Controller } from './v1';
import { AuthController } from './v1/auth';
import { OpenApiController } from './open-api.controller';

@Cors()
@Hook((ctx) => {
  if (ctx.request.method === 'OPTIONS') {
    console.log('opts', ctx.request.url)
    return new HttpResponseOK();
  }
  return response => {
    response
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', '*')
      .setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization')
      .setHeader('Access-Control-Allow-Credentials', 'true');
  }
})
export class AppController implements IAppController {
  subControllers = [
    controller('/api', V1Controller),
    controller('/auth', AuthController),
    controller('/swagger', OpenApiController),
  ];

  async init() {

  }

  handleError(error: any, ctx: Context): HttpResponse | Promise<HttpResponse> {
    console.log('AppController.handleError')

    if (isHttpResponse(error)) {
      return error;
    }

    return resolveHttpErrorResponse(error);
  }
}
