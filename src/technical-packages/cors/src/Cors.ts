import { Hook, HookDecorator } from '@foal/core';

import { setCors } from './setCors';
import { CorsOptions } from './types';

export const Cors = (options?: CorsOptions): HookDecorator => {
  return Hook(() => {
    return response => {
      setCors(response, options);
    }
  });
}
