import Joi from 'joi';

import { formatList } from '@zougui/utils';
import { Exception } from '@zougui/error';

export interface ConfigFileNotFoundErrorData {
  error: any;
}

export const ConfigFileNotFoundError = new Exception<ConfigFileNotFoundErrorData>()
  .setCode('error.config.read')
  .setMessage(data => `The config file could not be read: ${data.error?.message || data.error || 'No error details available'}`)
  .setStatus(500)
  .toClass();

export interface ConfigFileParseErrorData {
  error: any;
}

export const ConfigFileParseError = new Exception<ConfigFileParseErrorData>()
  .setCode('error.config.parse')
  .setMessage('The config file could not be parsed')
  .setStatus(500)
  .toClass();

export interface InvalidConfigFileErrorData {
  validationError: Joi.ValidationError;
}

export const InvalidConfigFileError = new Exception<InvalidConfigFileErrorData>()
  .setCode('error.config.invalid')
  .setMessage(data => formatList('The config is invalid', data.validationError.details.map(detail => detail.message)))
  .setStatus(500)
  .toClass();
