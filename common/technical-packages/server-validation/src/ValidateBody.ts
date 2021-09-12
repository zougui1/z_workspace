import { HttpResponseBadRequest } from '@foal/core';

import { createHookValidator } from './createHookValidator';

export const ValidateBody = createHookValidator('body', err => new HttpResponseBadRequest(err));
