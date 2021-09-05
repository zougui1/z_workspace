import { randomBoolean } from '@zougui/utils';

export const $randomBoolean = (): boolean => {
  return randomBoolean();
}

export interface RandomBooleanOperator {
  $randomBoolean: {};
}
