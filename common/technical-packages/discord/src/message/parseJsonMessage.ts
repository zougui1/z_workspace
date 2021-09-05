import Discord from 'discord.js';
import { ObjectSchema } from 'joi';

import { extractCode } from './format';
import { InvalidJsonMessageError } from './errors';

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
    const channelServer = message.channel as Partial<Discord.TextChannel>;
    const channelDm = message.channel as Partial<Discord.DMChannel>;

    throw new InvalidJsonMessageError({
      validation,
      message: {
        content: message.content,
        createdAt: message.createdAt,
        updatedAt: message.editedAt,
        author: message.author.username,
        channel: channelServer.name,
        dm: channelDm.recipient?.username,
        server: message.guild?.name,
      }
    });
  }

  return validation.value;
}


export interface ParseJsonMessageOptions {
  schema?: ObjectSchema;
}
