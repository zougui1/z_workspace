import fs from 'fs-extra';

import { readConfig } from './readConfig';

export const resolveReferences = async (config: Record<string, any>): Promise<Record<string, any>> => {
  for (const [key, value] of Object.entries(config)) {
    const cleanKey = key.replace(/^\$/, '');
    const isRef = key.startsWith('$');
    const isValidRef = typeof value === 'string' || value === null;

    if (isRef && isValidRef) {
      const pathExists = await fs.pathExists(value);

      if (!pathExists) {
        config[cleanKey] = undefined;
      } else {
        config[cleanKey] = await readConfig(value);
      }

      delete config[key];
    } else if(value && typeof value === 'object') {
      await resolveReferences(value);
    }
  }

  return config;
}
