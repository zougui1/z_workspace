import Discord from 'discord.js';
import { ObjectSchema } from 'joi';

import { findJsonMessages } from './findJsonMessages';
import { getChannelLocationMessage } from './getChannelLocationMessage';
import { getLastMessage, parseJsonMessage } from '../message';

export async function readLastJsonMessage(channel: Discord.TextChannel, options?: (ReadLastJsonMessageOptions & { required?: false })): Promise<ReadMessage | undefined>
export async function readLastJsonMessage(channel: Discord.TextChannel, options: ReadLastJsonMessageOptions & { required: true }): Promise<ReadMessage>
export async function readLastJsonMessage(channel: Discord.TextChannel, options: (ReadLastJsonMessageOptions & { required?: boolean }) = {}): Promise<ReadMessage | undefined> {
  const jsonMessages = await findJsonMessages(channel);
  const message = getLastMessage(jsonMessages);

  if (!message) {
    if (options.required) {
      throw new Error(`No JSON messages found ${getChannelLocationMessage(channel)}`);
    }

    return;
  }

  const data = parseJsonMessage(message, options);

  return { message, data };
}

export interface ReadLastJsonMessageOptions {
  schema?: ObjectSchema;
}

export type ReadMessage<T = unknown> = {
  message: Discord.Message;
  data: T;
}
