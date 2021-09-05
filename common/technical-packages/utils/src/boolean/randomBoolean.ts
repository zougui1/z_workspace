import { random } from '../math';

export const randomBoolean = (): boolean => {
  return !!random(0, 1);
}
