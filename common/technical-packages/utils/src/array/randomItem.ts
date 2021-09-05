import { randomIndex } from './randomIndex';

export const randomItem = <T>(val: T[]): T => {
  return val[randomIndex(val)];
}
