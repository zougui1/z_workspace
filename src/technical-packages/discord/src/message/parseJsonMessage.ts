import Discord from 'discord.js';
import { ObjectSchema } from 'joi';
import moment from 'moment';
import { logger, List, ExitScope } from '@zougui/logger';
import { Exception } from '@zougui/error';

import { extractCode } from './format';
import { getChannelLocationMessage } from '../channel';

export const parseJsonMessage = (message: Discord.Message, options: ParseJsonMessageOptions = {}) => {
  const dirtyJson = JSON.parse(extractCode(message.content, 'json'));

  if (!options.schema) {
    return dirtyJson;
  }

  return validateConfig(dirtyJson, options.schema, message);
}

const validateConfig = (config: unknown, schema: ObjectSchema, message: Discord.Message): unknown => {
  const validation = schema.validate(config, { abortEarly: false });

  if (validation.error) {
    const messages = validation.error.details.map(detail => detail.message);
    logger.error(new Exception(getErrorMessage(message), 'ERR_INVALID_JSON_MESSAGE', new List('', messages)));
    throw new ExitScope('config-validate', validation.error);
  }

  return validation.value;
}

const getErrorMessage = (message: Discord.Message): string => {
  const createdAt = moment(message.createdAt);
  const sentAt = `sent on ${createdAt.format('LL')} at ${createdAt.format('LT')}`;
  const errorMessage = `Invalid JSON message ${sentAt} ${getChannelLocationMessage(message.channel)}`;

  return errorMessage;
}


export interface ParseJsonMessageOptions {
  schema?: ObjectSchema;
}
