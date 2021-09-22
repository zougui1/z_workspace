import { SwaggerController } from '@foal/swagger';

import { V1Controller } from './v1';

export class OpenApiController extends SwaggerController {
  options = { controllerClass: V1Controller };
}
