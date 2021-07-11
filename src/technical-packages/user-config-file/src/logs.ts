import { LogBuilder } from '@zougui/logger';
import { IConstructedError } from '@zougui/error';
import env from '@zougui/env';

const scope = env.getScope(__filename);

export interface FileReadErrorLogData {
  error: IConstructedError;
}

export const FileReadErrorLog = new LogBuilder<FileReadErrorLogData>()
  .setCode('filesystem.file.read.error')
  .setScope(scope)
  .setTopics(['filesystem', 'file', 'read'])
  .setMessage(({ data }) => data.error.message)
  .toClass();

export interface JsonParseErrorLogData {
  error: IConstructedError;
}

export const JsonParseErrorLog = new LogBuilder<JsonParseErrorLogData>()
  .setCode('filesystem.file.parse.error')
  .setScope(scope)
  .setTopics(['filesystem', 'file', 'parse'])
  .setMessage(({ data }) => data.error.message)
  .toClass();

export interface ConfigValidationErrorLogData {
  error: IConstructedError;
}

export const ConfigValidationErrorLog = new LogBuilder<ConfigValidationErrorLogData>()
  .setCode('config.invalid')
  .setScope(scope)
  .setTopics(['config', 'validation'])
  .setMessage(({ data }) => data.error.message)
  .toClass();
