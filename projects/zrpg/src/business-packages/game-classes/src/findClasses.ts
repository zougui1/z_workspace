import { getClasses, Class } from '@zrpg/game-fs';

export const findClasses = async (): Promise<Class[]> => {
  return await getClasses();
}
