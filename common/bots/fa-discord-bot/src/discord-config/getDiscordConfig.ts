import Discord from 'discord.js';
import { readLastJsonMessage, ReadMessage } from '@zougui/discord';

import { discordConfigSchema } from './discordConfigSchema';
import { IDiscordConfig } from './discord-config-types';

export const getDiscordConfig = async (channel: Discord.TextChannel): Promise<ReadMessage<IDiscordConfig>> => {
  return await readLastJsonMessage(channel, { schema: discordConfigSchema, required: true }) as ReadMessage<IDiscordConfig>;
}
