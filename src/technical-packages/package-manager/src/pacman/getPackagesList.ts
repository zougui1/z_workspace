import { bash } from '@zougui/bash';

export const getPackagesList = async (): Promise<string[]> => {
  const pacman = bash.pacman({
    query: true,
    explicit: true,
  });

  const packageList = await pacman.exec();
  return packageList.split('\n').filter(line => line);
}
