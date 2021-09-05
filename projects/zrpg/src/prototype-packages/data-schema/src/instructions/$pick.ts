import _ from 'lodash';

import { randomFloat, randomItem, filterNullish } from '@zougui/utils';
import { Arrayable } from '@zougui/types';

import { $if } from './$if';
import { Picker, Pickable } from '../utils';

export function $pick<T>(option: Pickable<T | undefined>[]): Pickable<T | undefined>;
export function $pick<T>(option: Pickable<T | undefined>): Arrayable<T | undefined>;
export function $pick<T>(option: Arrayable<T | undefined>): T | undefined;
export function $pick<T>(option: Arrayable<Pickable<T | undefined>>): Pickable<Arrayable<T | undefined>> {
  if (Array.isArray(option)) {
    return randomItem(option);
  }

  if (_.isObject(option) && '$pick' in option) {
    return pickOnChance(option);
  }

  return option;
}

const pickOnChance = <T>(picker: Picker<T | undefined>): Arrayable<T | undefined> => {
  const conditionnedOptions = filterNullish(picker.$pick.$options.map(option => {
    if ('$if' in option) {
      const conditionnedOption = $if(option);

      if (conditionnedOption) {
        return conditionnedOption;
      }
    }

    if ('$chance' in option) {
      return option;
    }
  }));

  const sortedOptions = conditionnedOptions.sort((a, b) => a.$chance - b.$chance);
  const randomPercent = randomFloat(0, 100);
  const luckyOptions = sortedOptions.filter(option => option.$chance >= randomPercent);
  const luckyValues = luckyOptions.map(opt => opt.$value);

  return picker.$pick.$resolve === 'single'
    ? luckyValues[0]
    : luckyValues;
}
