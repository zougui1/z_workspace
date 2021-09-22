import { AbilityTuple, MongoQuery, PureAbility } from '@casl/ability';
import { HttpResponseForbidden } from '@foal/core';

export class BetterAbility<A extends AbilityTuple = AbilityTuple, C extends MongoQuery = MongoQuery> extends PureAbility<A, C> {

  must = (...args: Parameters<BetterAbility<A, C>['can']>): boolean => {
    if (!this.can(...args)) {
      throw new HttpResponseForbidden();
    }

    return true;
  }

  mustNot = (...args: Parameters<BetterAbility<A, C>['cannot']>): boolean => {
    if (!this.cannot(...args)) {
      throw new HttpResponseForbidden();
    }

    return true;
  }
}
