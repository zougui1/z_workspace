import moment from 'moment';
import { logger } from '@zougui/logger';
import { E621, Post } from '@zougui/e621';
import { range, wait } from '@zougui/utils';

import { fetchE621PagePosts } from './fetchE621PagePosts';
import { FetchedPostsLog, ReachedFailsafeDateLog, ReachedMaxPageLog, ReachedEndLog } from './logs';
import { IConfig } from '../../config';
import { IDiscordConfig } from '../../discord-config';
import { BrowsingData } from '../../browsing-data';
import { FAILSAFE_DATE_FORMAT } from '../../constants';

const PAGES = range(1, 20);

export const fetchE621Posts = async (options: FetchE621PostsOptions): Promise<Post[]> => {
  const { fileConfig, browsingDiscordConfig, browsingData } = options;

  const e621 = new E621({ username: fileConfig.browse.sources.e621.username, apiKey: fileConfig.browse.sources.e621.apiKey });

  const posts: Post[] = [];
  let brokeLoop = false;

  for (const page of PAGES) {
    const pagePosts = await fetchE621PagePosts(e621, browsingDiscordConfig, page);
    const unseenPosts = getUnseenPosts(pagePosts, browsingData, browsingData.lastPosts.e621.failsafeDate);
    posts.push(...unseenPosts);
    logger.info(new FetchedPostsLog({
      posts: pagePosts.map(p => p.url),
      unseenPosts: unseenPosts.map(p => p.url),
    }));

    if (unseenPosts.length !== pagePosts.length) {
      logger.info(new ReachedEndLog({
        posts: posts.map(p => p.url),
        unseenPosts: unseenPosts.map(p => p.url),
      }));
      brokeLoop = true;
      break;
    }

    // rate limiter
    await wait(fileConfig.browse.fetchSubmissionInterval);
  }

  if (!brokeLoop) {
    logger.info(new ReachedMaxPageLog({ maxPage: PAGES[PAGES.length - 1] }));
  }

  return posts;
}

const getUnseenPosts = (posts: Post[], browsingData: BrowsingData, failsafeDate?: string): Post[] => {
  const unseenPosts: Post[] = [];
  const failsafeTimestamp = failsafeDate
    ? moment(failsafeDate, FAILSAFE_DATE_FORMAT).toDate().valueOf()
    : 0;

  for (const post of posts) {
    const isAfterFailsafeDate = failsafeTimestamp > post.createdAt.valueOf();
    const reachedSeenPosts = browsingData.lastPosts.e621.url === post.url;

    if (reachedSeenPosts || isAfterFailsafeDate) {
      if (!reachedSeenPosts) {
        logger.info(new ReachedFailsafeDateLog({ date: failsafeDate }));
      }

      break;
    }

    unseenPosts.push(post);
  }

  return unseenPosts;
}

export interface FetchE621PostsOptions {
  fileConfig: IConfig;
  browsingDiscordConfig: IDiscordConfig;
  browsingData: BrowsingData;
}
