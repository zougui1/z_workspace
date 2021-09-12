import { Ability as CaslAbility, AbilityTuple, Subject, MongoQuery } from '@casl/ability';

type BasicAbility = CaslAbility<AbilityTuple<string, Subject>, MongoQuery<Record<string, any>>>;
export type Ability = BasicAbility & {
  must: BasicAbility['can'];
  mustNot: BasicAbility['cannot'];
};

export interface AbilityState {
  ability: Ability;
}
