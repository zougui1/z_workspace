import { randomIndex } from '../array';

export const randomChar = (val: string): string => {
  return val[randomIndex(val)];
}
