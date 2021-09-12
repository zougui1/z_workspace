import { toArray } from '@zougui/utils';

import { abilitiesDefiner } from './abilitiesDefiner';
import { Ability } from './abilityTypes';

// TODO types
export const defineAbilitiesFor = (user: any): Promise<Ability> => {
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
