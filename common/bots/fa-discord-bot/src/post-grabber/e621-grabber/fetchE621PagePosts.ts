import { E621, E621Ratings, Post } from '@zougui/e621';

import { Ratings } from '../../enums';
import { IDiscordConfig } from '../../discord-config';

export const fetchE621PagePosts = async (e621: E621, config: IDiscordConfig, page: number = 1): Promise<Post[]> => {
  return await e621.getPosts({
    includes: {
      keywords: config.includes?.keywords,
    },
    excludes: {
      keywords: config.excludes?.keywords,
      ratings: getRatingsToExclude(config.ratings),
      when: config.excludes?.when,
    },
    page,
  });
}

const getRatingsToExclude = (ratings: Ratings[]): E621Ratings[] => {
  const includesSfw = ratings.includes(Ratings.SFW);
  const includesNsfw = ratings.includes(Ratings.NSFW);

  if (includesSfw && includesNsfw) {
    return [];
  }

  if (includesSfw) {
    return [E621Ratings.questionable, E621Ratings.explicit];
  }

  return [E621Ratings.safe];
}
