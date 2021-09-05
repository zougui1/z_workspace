import { PartialException } from '@zougui/error';

import {
  AccessError,
  AlreadyExistsError,
  DirNotEmptyError,
  IsDirectoryError,
  NotDirError,
  NotFoundError,
  PermissionError,
  TooManyOpenFilesError,
  UnknownFileSystemError,
  FileSystemErrorData
} from './errors';

const fsErrorMap: Record<string, (new (data: FileSystemErrorData) => PartialException<FileSystemErrorData>) | undefined> = {
  EACCES: AccessError,
  EEXIST: AlreadyExistsError,
  EISDIR: IsDirectoryError,
  EMFILE: TooManyOpenFilesError,
  ENOENT: NotFoundError,
  ENOTDIR: NotDirError,
  ENOTEMPTY: DirNotEmptyError,
  EPERM: PermissionError,
};

export const getFileSystemError = (error: any, pathName: string): PartialException<FileSystemErrorData> => {
  const FsError = fsErrorMap[error?.code as any] || UnknownFileSystemError;
  return new FsError({ pathName, error });
}

export const fsErrorWrapper = <TReturn>(fsFunc: (pathName: string, ...args: any[]) => Promise<TReturn>) => async (pathName: string, ...args: any[]): Promise<TReturn> => {
  try {
    return await fsFunc(pathName, ...args);
  } catch (error: any) {
    throw getFileSystemError(error, pathName);
  }
}
