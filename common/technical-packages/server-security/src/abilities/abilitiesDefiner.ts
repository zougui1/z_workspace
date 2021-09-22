import { AbilityBuilder, Ability } from '@casl/ability';

import { BetterAbility } from './BetterAbility';

export const abilitiesDefiner = async (defineUserAbilities: ((abilityBuilder: AbilityBuilder<Ability>) => any | Promise<any>)): Promise<BetterAbility> => {
  const abilityBuilder = new AbilityBuilder(Ability);
  await defineUserAbilities(abilityBuilder);
  const ability = new BetterAbility(abilityBuilder.rules);

  return ability;
}
