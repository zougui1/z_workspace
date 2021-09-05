import path from 'path';

import { Context, Hook, HookDecorator } from '@foal/core';

import { sanitizeFileName } from '../utils';
import { FILE_STORAGE_DIR } from '../env';

export const GetFilePath = (getPathData: ((ctx: Context) => FilePathData)): HookDecorator => {
  return Hook(ctx => {
    const pathData = getPathData(ctx);
    const dirParts = pathData.dirParts.map(part => sanitizeFileName(String(part)));
    const dir = path.join(FILE_STORAGE_DIR, ...dirParts);
    const fileName = sanitizeFileName(String(pathData.fileName));

    ctx.state.dir = dir;
    ctx.state.fileName = fileName;
    ctx.state.file = path.join(dir, fileName);
  });
}

export interface FilePathData {
  dirParts: any[];
  fileName: any;
}

export interface FilePathState {
  /**
   * path to the directory
   */
  dir: string;
  /**
   * name of the file
   */
  fileName: string;
  /**
   * path to the file
   */
  file: string;
}
