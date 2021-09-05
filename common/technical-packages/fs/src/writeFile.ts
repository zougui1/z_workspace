import path from 'path';

import { encrypt, EncryptOptions } from '@zougui/encryption';

import * as betterFs from './fsWrapped';

export const writeFile = async (pathName: string, data: string | Buffer, options?: WriteFileOptions): Promise<void> => {
  if (options?.ensureDir) {
    await betterFs.ensureDir(path.dirname(pathName));
  }

  const fileData = options?.password
    ? await encrypt(data, options.password, options)
    : data;

  const file = options?.password
    ? `${pathName}.enc`
    : pathName;

  await betterFs.writeFile(file, fileData);
}

export interface BaseWriteFileOptions {
  ensureDir?: boolean;
}

export interface WritePlainFileOptions extends BaseWriteFileOptions {
  password?: undefined;
}

export interface WriteEncryptedFileOptions extends EncryptOptions, BaseWriteFileOptions {
  password: string;
}

export type WriteFileOptions = WritePlainFileOptions | WriteEncryptedFileOptions;
