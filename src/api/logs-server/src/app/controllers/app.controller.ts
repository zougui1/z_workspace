import { controller, IAppController, Context, HttpResponse } from '@foal/core';

import { ApiController } from './api';
import { OpenApiController } from './open-api.controller';
import { resolveHttpErrorResponse } from '../utils';
import { Cors } from '../hooks';

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
