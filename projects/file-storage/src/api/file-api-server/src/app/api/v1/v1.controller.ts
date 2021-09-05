import { IAppController, controller, ApiInfo, ApiServer } from '@foal/core';

import { FileController } from './file';

@ApiInfo({
  title: 'Log API V1',
  version: '1.0.0',
})
@ApiServer({
  url: '/api/v1',
})
export class V1Controller implements IAppController {
  subControllers = [
    controller('/files', FileController),
  ];
}
