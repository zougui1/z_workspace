import Discord from 'discord.js';

import { isCodeBlock } from '../message';

export const findJsonMessages = async (channel: Discord.TextChannel): Promise<Discord.Message[]> => {
  const messages = await channel.messages.fetch();
  return messages.filter(message => isCodeBlock(message.content, 'json')).array();
}
