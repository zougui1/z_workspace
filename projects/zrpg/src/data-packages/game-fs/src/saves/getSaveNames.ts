import fs from 'fs-extra';
import path from 'path';

import { gameSavesDir } from '../env';

export const getSaveNames = async (): Promise<string[]> => {
  const nodeNames = await fs.readdir(gameSavesDir);
  const nodePaths = nodeNames.map(name => path.join(gameSavesDir, name));
  const areFiles = await Promise.all(nodePaths.map(isFile));
  const filePaths = nodePaths.filter((_, i) => areFiles[i]);
  const fileNames = filePaths.map(file => path.basename(file).split('.')[0]);

  return fileNames;
}

const isFile = async (nodePath: string): Promise<boolean> => {
  const fileStat = await fs.lstat(nodePath);
  return fileStat.isFile();
}
