import prettyBytes from 'pretty-bytes';

import { getFolderSize, IGetFolderSizeOptions } from './getFolderSize';

/**
 * Returns the size of the folder. If any errors are encountered while traversing the folder, they are silently ignored.
 *
 * The returned folder size might be smaller than the real folder size. It is impossible to know for sure, since errors are ignored.
 *
 * @param {string} itemPath         - Path of the folder.
 * @param {object} [options]        - Options.
 * @param {object} [options.ignore] - If a file's path matches this regex object, its size is not counted.
 * @returns {Promise<number>} - The size of the folder.
 */
export const getPrettyFolderSize = async (rootItemPath: string, options: IGetFolderSizeOptions = {}): Promise<string> => {
  const size = await getFolderSize(rootItemPath, options);
  return prettyBytes(size);
}
