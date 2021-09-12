import fs from 'fs-extra';
import path from 'path';

import { gameSavesDir } from '../env';

export const getSave = async (saveName: string): Promise<unknown> => {
  const saveFile = path.join(gameSavesDir, saveName);
  const fileStr = await fs.readFile(saveFile, 'utf8');

  return JSON.parse(fileStr);
}
