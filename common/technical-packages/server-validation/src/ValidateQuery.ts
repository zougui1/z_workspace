import { HttpResponseBadRequest } from '@foal/core';

import { createHookValidator } from './createHookValidator';

export const ValidateQuery = createHookValidator('query', err => new HttpResponseBadRequest(err));
