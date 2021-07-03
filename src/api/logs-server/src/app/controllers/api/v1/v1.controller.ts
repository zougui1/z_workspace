import { Context, Get, HttpResponseOK, IAppController, controller, ApiInfo, ApiServer } from '@foal/core';

import { LogController } from './log';

@ApiInfo({
  title: 'Log API V1',
  version: '1.0.0',
})
@ApiServer({
  url: '/api/v1',
})
export class V1Controller implements IAppController {
  subControllers = [
    controller('/logs', LogController),
  ];

  @Get('/')
  index(ctx: Context) {
    return new HttpResponseOK('Hello world!');
  }

}
