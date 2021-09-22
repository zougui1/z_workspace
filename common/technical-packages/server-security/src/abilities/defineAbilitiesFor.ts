import { toArray } from '@zougui/utils';

import { abilitiesDefiner } from './abilitiesDefiner';
import { BetterAbility } from './BetterAbility';

// TODO types
export const defineAbilitiesFor = (user: any): Promise<BetterAbility> => {
  return abilitiesDefiner(({ can, cannot }) => {
    for (const role of toArray(user.roles)) {
      for (const permission of toArray(role?.permissions)) {
        if (permission?.ability === 'can') {
          can(permission.actions, permission.subjects);
        } else if (permission?.ability === 'cannot') {
          cannot(permission.actions, permission.subjects);
        }
      }
    }
  });
}
