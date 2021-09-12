import { controller, IAppController } from '@foal/core';

import { ApiController } from './api';

export class AppController implements IAppController {
  subControllers = [
    controller('/api', ApiController),
  ];

  async init() {

  }
}
