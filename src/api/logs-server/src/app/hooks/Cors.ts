import { Hook, HookDecorator } from '@foal/core';

import { setCors } from '../utils';

export const Cors = (): HookDecorator => {
  return Hook(() => {
    return response => {
      setCors(response);
    }
  });
}
