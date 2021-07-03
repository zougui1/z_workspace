import { Log } from '@zougui/logger';

export interface FetchedPostsLogData {
  posts: string[];
  unseenPosts: string[];
}

export const FetchedPostsLog = new Log<FetchedPostsLogData>()
  .setCode('e621.posts.fetched')
  .setTopics(['e621', 'posts', 'http'])
  .setMessage(({ data }) => `${data.posts.length} posts found. ${data.unseenPosts.length} of which were not already seen.`)
  .toClass();

export interface ReachedFailsafeDateLogData {
  date?: string;
}

export const ReachedFailsafeDateLog = new Log<ReachedFailsafeDateLogData>()
  .setCode('e621.posts.end.failsafe.date')
  .setTopics(['e621', 'posts'])
  .setMessage('Reached failsafe date')
  .toClass();

export interface ReachedMaxPageLogData {
  maxPage: number;
}

export const ReachedMaxPageLog = new Log<ReachedMaxPageLogData>()
  .setCode('e621.posts.end.failsafe.maxPage')
  .setTopics(['e621', 'posts'])
  .setMessage('Reached max page')
  .toClass();


export interface ReachedEndLogData {
  posts: string[];
  unseenPosts: string[];
}

export const ReachedEndLog = new Log<ReachedEndLogData>()
  .setCode('e621.posts.end')
  .setTopics(['e621', 'posts'])
  .setMessage('Reached the end of posts')
  .toClass();
