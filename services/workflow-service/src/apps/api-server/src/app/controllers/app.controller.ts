import { controller, IAppController, Context, HttpResponse } from '@foal/core';

import { Cors } from '@zougui/cors';
import { resolveHttpErrorResponse } from '@zougui/http-error';

import { ApiController } from './api';
import { OpenApiController } from './open-api.controller';

@Cors()
export class AppController implements IAppController {
  subControllers = [
    controller('/api', ApiController),
    controller('/swagger', OpenApiController),
  ];

  async init() {

  }

  handleError(error: any, ctx: Context): HttpResponse | Promise<HttpResponse> {
    return resolveHttpErrorResponse(error);
  }
}
