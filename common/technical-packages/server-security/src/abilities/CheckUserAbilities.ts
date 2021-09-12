import { MergeHooks, HookDecorator } from '@foal/core';

import { DefineUserAbilities } from './DefineUserAbilities';
import { CheckAbilities, AbilitiesChecker } from './CheckAbilities';

export const CheckUserAbilities = (checkUserAbilities: AbilitiesChecker): HookDecorator => {
  return MergeHooks(DefineUserAbilities(), CheckAbilities(checkUserAbilities));
}
