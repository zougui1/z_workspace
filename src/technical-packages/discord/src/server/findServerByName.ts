import Discord from 'discord.js';

export const findServerByName = (client: Discord.Client, name: string): Discord.Guild | undefined => {
  return client.guilds.cache.find(server => server.name === name);
}
