import { LogBuilder } from '@zougui/logger';
import { IConstructedError } from '@zougui/error';

export interface FileReadErrorLogData {
  error: IConstructedError;
}

export const FileReadErrorLog = new LogBuilder<FileReadErrorLogData>()
  .setCode('filesystem.file.read.error')
  .setVersion('1.0')
  .setTopics(['filesystem', 'file', 'read'])
  .setMessage(({ data }) => data.error.message)
  .toClass();

export interface JsonParseErrorLogData {
  error: IConstructedError;
}

export const JsonParseErrorLog = new LogBuilder<JsonParseErrorLogData>()
  .setCode('filesystem.file.parse.error')
  .setVersion('1.0')
  .setTopics(['filesystem', 'file', 'parse'])
  .setMessage(({ data }) => data.error.message)
  .toClass();

export interface ConfigValidationErrorLogData {
  error: IConstructedError;
}

export const ConfigValidationErrorLog = new LogBuilder<ConfigValidationErrorLogData>()
  .setCode('config.invalid')
  .setVersion('1.0')
  .setTopics(['config', 'validation'])
  .setMessage(({ data }) => data.error.message)
  .toClass();
