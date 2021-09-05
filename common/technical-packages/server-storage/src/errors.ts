import { ErrorBuilder } from '@zougui/error';

export const FileStateMissingError = new ErrorBuilder()
  .setCode('storage.hooks.fileState.missing')
  .setMessage('File state is missing')
  .setStatus(500)
  .toClass();
