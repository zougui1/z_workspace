import { ErrorBuilder } from '@zougui/error';

export interface FileSystemErrorData {
  pathName: string;
  error: any;
}

export const AccessError = new ErrorBuilder<FileSystemErrorData>()
  .setCode('filesystem.errors.access')
  .setStatus(500)
  .setMessage('An attempt was made to access a file in a way forbidden by its file access permissions.')
  .toClass();

export const AlreadyExistsError = new ErrorBuilder<FileSystemErrorData>()
  .setCode('filesystem.errors.alreadyExists')
  .setStatus(500)
  .setMessage('An existing file was the target of an operation that required that the target does not exist.')
  .toClass();

export const IsDirectoryError = new ErrorBuilder<FileSystemErrorData>()
  .setCode('filesystem.errors.isDirectory')
  .setStatus(500)
  .setMessage('An operation expected a file, but the given pathName was a directory.')
  .toClass();

export const TooManyOpenFilesError = new ErrorBuilder<FileSystemErrorData>()
  .setCode('filesystem.errors.tooManyOpenFiles')
  .setStatus(500)
  .setMessage('Too many files are open in filesystem.')
  .toClass();

export const NotFoundError = new ErrorBuilder<FileSystemErrorData>()
  .setCode('filesystem.errors.notFound')
  .setStatus(500)
  .setMessage('A component of the given pathName does not exist.')
  .toClass();

export const NotDirError = new ErrorBuilder<FileSystemErrorData>()
  .setCode('filesystem.errors.notDir')
  .setStatus(500)
  .setMessage('A component of the given pathName existed, but was not a directory as expected.')
  .toClass();

export const DirNotEmptyError = new ErrorBuilder<FileSystemErrorData>()
  .setCode('filesystem.errors.dirNotEmpty')
  .setStatus(500)
  .setMessage('A directory with entries was the target of an operation that requires an empty directory.')
  .toClass();

export const PermissionError = new ErrorBuilder<FileSystemErrorData>()
  .setCode('filesystem.errors.permission')
  .setStatus(500)
  .setMessage('An attempt was made to perform an operation that requires elevated privileges.')
  .toClass();

export const UnknownFileSystemError = new ErrorBuilder<FileSystemErrorData>()
  .setCode('filesystem.errors.unknown')
  .setStatus(500)
  .setMessage('An unknown error occured while performing a filesystem operation.')
  .toClass();

export const StreamUnsupportedForEncryptedFilesError = new ErrorBuilder<FileSystemErrorData>()
  .setCode('filesystem.errors.streamUnsupportedForEncryptedFiles')
  .setStatus(500)
  .setMessage('File stream is not supported for encrypted files.')
  .toClass();

export const MissingPasswordForDecryptionError = new ErrorBuilder<FileSystemErrorData>()
  .setCode('filesystem.errors.streamUnsupportedForEncryptedFiles')
  .setStatus(500)
  .setMessage('File stream is not supported for encrypted files.')
  .toClass();
