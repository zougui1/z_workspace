import { Hook, HookDecorator } from '@foal/core';
import { AbilityBuilder, Ability } from '@casl/ability';

export const DefineExtraAbilities = (defineExtraAbilities: ((abilityBuilder: AbilityBuilder<Ability>) => any | Promise<any>)): HookDecorator => {
  return Hook(async ctx => {
    const abilityBuilder = new AbilityBuilder(Ability);
    await defineExtraAbilities(abilityBuilder);
    const ability = new Ability(abilityBuilder.rules);

    ctx.state.ability = ability;
  });
}
