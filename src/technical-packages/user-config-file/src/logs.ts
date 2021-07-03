import { Log } from '@zougui/logger';
import { Exception } from '@zougui/error';

export interface FileReadErrorLogData {
  error: Exception;
}

export const FileReadErrorLog = new Log<FileReadErrorLogData>()
  .setCode('filesystem.file.read.error')
  .setTopics(['filesystem', 'file', 'read'])
  .setMessage(({ data }) => data.error.message)
  .toClass();

export interface JsonParseErrorLogData {
  error: Exception;
}

export const JsonParseErrorLog = new Log<JsonParseErrorLogData>()
  .setCode('filesystem.file.parse.error')
  .setTopics(['filesystem', 'file', 'parse'])
  .setMessage(({ data }) => data.error.message)
  .toClass();

export interface ConfigValidationErrorLogData {
  error: Exception;
}

export const ConfigValidationErrorLog = new Log<ConfigValidationErrorLogData>()
  .setCode('config.invalid')
  .setTopics(['config', 'validation'])
  .setMessage(({ data }) => data.error.message)
  .toClass();
