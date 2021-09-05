import path from 'path';

import { getConfig } from '@zougui/user-config-file';

import { classesSchema } from './classesSchema';
import { ClassesData, Class } from './classes-types';
import { gameDataDir } from '../env';

export const getClasses = async (): Promise<Class[]> => {
  const classesFile = path.join(gameDataDir, 'classes.json');
  const classes = await getConfig({
    file: classesFile,
    schema: classesSchema,
  }) as ClassesData;

  return classes.data.filter(classData => !('status' in classData && classData.status === 'todo')) as Class[];
}
