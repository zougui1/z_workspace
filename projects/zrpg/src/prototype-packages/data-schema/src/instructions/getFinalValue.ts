import _ from 'lodash';

import { Arrayable } from '@zougui/types';

import { $if } from './$if';
import { $pick } from './$pick';
import { Branch, Picker } from '../utils';

export const getFinalValue = <T>(value: Arrayable<T | undefined | Branch<T | undefined> | Picker<T | undefined>>): T | undefined => {
  if (_.isObject(value)) {
    if ('$if' in value) {
      const branched = $if(value);
      return getFinalValue(branched);
    }

    return getFinalValue($pick(value));
  }

  return value;
}
