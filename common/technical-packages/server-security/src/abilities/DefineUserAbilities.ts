import { Hook, HookDecorator, HttpResponseUnauthorized, HttpResponseForbidden, Context } from '@foal/core';

import { defineAbilitiesFor } from './defineAbilitiesFor';
import { Ability, AbilityState } from './abilityTypes';

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

    ability.must = (...args: Parameters<Ability['can']>): boolean => {
      if (!ability.can(...args)) {
        throw new HttpResponseForbidden();
      }

      return true;
    }

    ability.mustNot = (...args: Parameters<Ability['cannot']>): boolean => {
      if (!ability.cannot(...args)) {
        throw new HttpResponseForbidden();
      }

      return true;
    }

    ctx.state.ability = ability;
  });
}
