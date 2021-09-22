import { IController, controller, ApiInfo, ApiServer } from '@foal/core';

import { UserController } from './user';
import { AuthController } from './auth';

@ApiInfo({
  title: 'Log API V1',
  version: '1.0.0',
})
@ApiServer({
  url: '/v1',
})
export class V1Controller implements IController {
  subControllers = [
    controller('/users', UserController),
    controller('/auth', AuthController),
  ];
}
