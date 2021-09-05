import { Readable } from 'stream';

import fs from 'fs-extra';

import { decrypt, DecryptOptions } from '@zougui/encryption';

import * as betterFs from './fsWrapped';
import { getFileSystemError } from './fsErrorWrapper';
import { NotFoundError } from './errors';

export enum FileContentType {
  buffer = 'buffer',
  utf8 = 'utf8',
  stream = 'stream',
}

const readFileForContentTypeMap = {
  [FileContentType.buffer]: async (file: string): Promise<Buffer> => {
    return await betterFs.readFile(file);
  },

  [FileContentType.utf8]: async (file: string): Promise<string> => {
    return await betterFs.readFile(file, 'utf8');
  },

  hex: async (file: string): Promise<string> => {
    return await betterFs.readFile(file, 'hex');
  },

  [FileContentType.stream]: (file: string): Promise<Readable> => {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(file);

      stream.once('error', nativeError => {
        const error = getFileSystemError(nativeError, file);

        if (error instanceof NotFoundError) {
          reject(error);
        }
      });

      stream.once('open', () => resolve(stream));
    });
  },

  default: async (file: string): Promise<Buffer> => {
    return await betterFs.readFile(file);
  },
};

export async function readFile(pathName: string, options?: ReadFileOptions & { contentType?: FileContentType.buffer }): Promise<File<Buffer>>;
export async function readFile(pathName: string, options: ReadFileOptions & { contentType: FileContentType.stream }): Promise<File<Readable>>;
export async function readFile(pathName: string, options: ReadFileOptions & { contentType: FileContentType.utf8 }): Promise<File<string>>;
export async function readFile(pathName: string, options?: ReadFileOptions & {
  resolveNotFound: true,
  contentType?: FileContentType.buffer,
}): Promise<File<Buffer | undefined>>;
export async function readFile(pathName: string, options: ReadFileOptions & {
  resolveNotFound: true,
  contentType: FileContentType.stream,
}): Promise<File<Readable | undefined>>;
export async function readFile(pathName: string, options: ReadFileOptions & {
  resolveNotFound: true,
  contentType: FileContentType.utf8,
}): Promise<File<string | undefined>>;
export async function readFile(pathName: string, options: ReadFileOptions & { resolveNotFound: true }): Promise<File<string | undefined>>;
export async function readFile(pathName: string, options: ReadFileOptions): Promise<File<string | Buffer | Readable>>;
export async function readFile(pathName: string, options?: ReadFileOptions): Promise<File<string | Readable | Buffer | undefined>> {
  if (options?.contentType === FileContentType.stream && options?.password) {
    throw new Error('File stream is not supported for encrypted files');
  }

  const fileReader = readFileForContentTypeMap[options?.contentType as FileContentType] || readFileForContentTypeMap.default;
  let fileData: string | Buffer | Readable | undefined;

  try {
    fileData = await fileReader(pathName);
  } catch (error) {
    if (!(error instanceof NotFoundError)) {

      throw error;
    }

    if (!options?.password) {
      if (options?.resolveNotFound) {
        return { wasEncrypted: false, file: undefined };
      }

      throw error;
    }
  }

  if (fileData !== undefined) {
    return {
      wasEncrypted: false,
      file: fileData,
    };
  }

  if (!options?.password) {
    throw new Error('Cannot read encrypted file without a password');
  }

  let encryptedFileData: string | undefined;

  try {
    encryptedFileData = await readFileForContentTypeMap.utf8(`${pathName}.enc`);
  } catch (error) {
    if (error instanceof NotFoundError && options?.resolveNotFound) {
      return { wasEncrypted: false, file: undefined };
    }

    throw error;
  }

  const decryptedFile = await decrypt(encryptedFileData, options.password, {
    hashTime: options.hashTime,
    saltLeft: options.saltLeft,
    saltRight: options.saltRight,
    contentType: options.contentType === FileContentType.buffer
      ? 'buffer'
      : 'utf8'
  });

  return {
    wasEncrypted: true,
    file: decryptedFile,
  };
}

interface EncryptedFile<TFile> {
  wasEncrypted: true;
  file: TFile;
}

interface PlainFile<TFile> {
  wasEncrypted?: false;
  file: TFile;
}

type File<TFile> = EncryptedFile<TFile> | PlainFile<TFile>;

interface BaseReadFileOptions {
  contentType?: FileContentType;
  resolveNotFound?: boolean;
}

interface ReadEncryptedFileOptions extends BaseReadFileOptions {
  hashTime?: DecryptOptions['hashTime'];
  saltLeft: DecryptOptions['saltLeft'];
  saltRight: DecryptOptions['saltRight'];
  password: string;
}

interface ReadPlainFileOptions extends BaseReadFileOptions {
  password?: undefined;
}

export type ReadFileOptions = ReadPlainFileOptions | ReadEncryptedFileOptions;
