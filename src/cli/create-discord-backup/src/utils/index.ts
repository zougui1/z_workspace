import Discord from 'discord.js';

export const ensureLogChannel = async (guild: Discord.Guild, name: string): Promise<Discord.TextChannel | Discord.NewsChannel> => {
  const channel = guild.channels.cache.find(channel => channel.name === name);

  if (channel && channel.isText()) {
    return channel;
  }

  return await guild.channels.create(name);
}
