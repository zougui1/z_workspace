import path from 'path';

import fs from 'fs-extra';

/**
 * Returns the size of the folder. If any errors are encountered while traversing the folder, they are silently ignored.
 *
 * The returned folder size might be smaller than the real folder size. It is impossible to know for sure, since errors are ignored.
 *
 * @param {string} itemPath         - Path of the folder.
 * @param {object} [options]        - Options.
 * @param {object} [options.ignore] - If a file's path matches this regex object, its size is not counted.
 * @returns {Promise<number>} - The size of the folder in bytes.
 */
export const getFolderSize = async (rootItemPath: string, options: IGetFolderSizeOptions = {}): Promise<number> => {
  const fileSizes = new Map();

  const processItem = async (itemPath: string): Promise<void> => {
    if (options.ignore?.test(itemPath)) {
      return;
    }

    const stats = await fs.lstat(itemPath).catch(() => {});
    if (!stats) {
      return;
    }

    fileSizes.set(stats.ino, stats.size);

    if(stats.isDirectory()) {
      const directoryItems = await fs.readdir(itemPath).catch(() => { });

      if (!directoryItems) {
        return;
      }

      await Promise.all(
        directoryItems.map(directoryItem =>
          processItem(path.join(itemPath, directoryItem))
        )
      );
    }
  }

  await processItem(rootItemPath);

  const folderSize = Array.from(fileSizes.values()).reduce((total, fileSize) => total + fileSize, 0);
  return folderSize;
}

export interface IGetFolderSizeOptions {
  ignore?: RegExp;
}
