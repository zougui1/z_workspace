import { random } from '../math';

export const randomIndex = (val: any[] | string): number => {
  if (!val.length) {
    return 0;
  }

  return random(0, val.length - 1);
}
