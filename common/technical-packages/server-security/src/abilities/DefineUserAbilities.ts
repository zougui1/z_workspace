import { Hook, HookDecorator, HttpResponseUnauthorized, Context } from '@foal/core';

import { defineAbilitiesFor } from './defineAbilitiesFor';
import { AbilityState } from './abilityTypes';

export const DefineUserAbilities = (): HookDecorator => {
  return Hook(async (ctx: Context<any, any, AbilityState>) => {
    if (!ctx.user) {
      return new HttpResponseUnauthorized();
    }

    if (ctx.state.ability) {
      return;
    }

    const ability = await defineAbilitiesFor(ctx.user);

    // those functions need to be bound to be usable in other functions
    ability.can = ability.can.bind(ability);
    ability.cannot = ability.cannot.bind(ability);

    ctx.state.ability = ability;
  });
}
