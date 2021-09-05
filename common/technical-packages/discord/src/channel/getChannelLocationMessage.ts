import Discord from 'discord.js';

const guildChannelTypes: Discord.Channel['type'][] = ['text', 'news', 'voice'];

export const getChannelLocationMessage = (channel: Discord.Channel): string => {
  const isFromGuild = guildChannelTypes.includes(channel.type);
  const isDm = channel.type === 'dm';
  const isGroup = channel.type === 'group';

  const guildChannel = channel as Discord.GuildChannel;
  const dmChannel = channel as Discord.DMChannel;
  const groupChannel = channel as Discord.PartialGroupDMChannel;

  const location = isFromGuild
    ? `in channel "${guildChannel.name}"`
    : isGroup
      ? `in group "${groupChannel.name}"`
      : isDm
        ? `in "${dmChannel.recipient.username}"'s DMs`
        : 'in an unknown channel';

  const channelLocation = isFromGuild && guildChannel.parent
    ? `from the category "${guildChannel.parent.name}"`
    : '';

  return `${location} ${channelLocation}`.trim();
}
