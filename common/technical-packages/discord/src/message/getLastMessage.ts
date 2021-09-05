import Discord from 'discord.js';

export const getLastMessage = (messages: Discord.Message[]): Discord.Message => {
  const ascSortedMessages = messages.slice().sort((a, b) => getTimestamp(a) - getTimestamp(b));
  return ascSortedMessages[ascSortedMessages.length - 1];
}

const getTimestamp = (message: Discord.Message): number => {
  return message.editedTimestamp || message.createdTimestamp;
}
