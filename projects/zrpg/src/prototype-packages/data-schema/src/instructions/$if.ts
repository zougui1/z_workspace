import _ from 'lodash';

import { toArray } from '@zougui/utils';

import { Branch } from '../utils';

export const $if = <T>(branch: Branch<T | undefined>): T | undefined => {
  if (branch.$if.$cond) {
    return branch.$if.$then;
  }

  if (branch['$else if']) {
    const elseIfs = toArray(branch['$else if']);
    const passingElseIf = elseIfs.find(elseIf => elseIf.$cond);

    if(passingElseIf) {
      return passingElseIf.$then;
    }
  }

  if (branch.$else) {
    return branch.$else;
  }
}
