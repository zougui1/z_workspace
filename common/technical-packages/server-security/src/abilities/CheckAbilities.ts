import { Hook, HookDecorator, Context } from '@foal/core';

import { AbilityState } from './abilityTypes';
import { BetterAbility } from './BetterAbility';

export const CheckAbilities = (checkUserAbilities: AbilitiesChecker): HookDecorator => {
  return Hook(async (ctx: Context<any, any, Partial<AbilityState>>) => {
    const { ability } = ctx.state;

    if (!ability) {
      throw new Error('Missing user ability rules.');
    }

    await checkUserAbilities(ability, ctx as Context<any, any, AbilityState>);
  });
}

export type AbilitiesChecker = (ability: BetterAbility, ctx: Context<any, any, AbilityState>) => any | Promise<any>;
