import { AbilityBuilder, Ability } from '@casl/ability';

import { Ability as AbilityType } from './abilityTypes';

export const abilitiesDefiner = async (defineUserAbilities: ((abilityBuilder: AbilityBuilder<Ability>) => any | Promise<any>)): Promise<AbilityType> => {
  const abilityBuilder = new AbilityBuilder(Ability);
  await defineUserAbilities(abilityBuilder);
  const ability = new Ability(abilityBuilder.rules);

  return ability as AbilityType;
}
