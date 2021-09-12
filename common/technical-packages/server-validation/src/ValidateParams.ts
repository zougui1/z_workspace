import { HttpResponseNotFound } from '@foal/core';

import { createHookValidator } from './createHookValidator';

export const ValidateParams = createHookValidator('params', () => new HttpResponseNotFound());
