import Discord from 'discord.js';

import { logger } from '@zougui/logger';

import { SetUserActivityErrorLog } from './logs';

export const safelySetActivity = async (user: Discord.ClientUser | undefined | null, activity?: string) => {
  if (!user) {
    return;
  }

  try {
    await user.setActivity(activity as string);
  } catch (error) {
    logger.error(new SetUserActivityErrorLog({ error, bot: user.username }));
  }
}
