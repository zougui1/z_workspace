import { IAppController, controller, ApiInfo, ApiServer, Log } from '@foal/core';

import { V1Controller } from './v1';

@ApiInfo({
  title: 'Log API',
  version: '1.0.0',
})
@ApiServer({
  url: '/api',
})
@Log('API', { body: true, params: true, query: true })
export class ApiController implements IAppController {
  subControllers = [
    controller('/v1', V1Controller),
  ];
}
