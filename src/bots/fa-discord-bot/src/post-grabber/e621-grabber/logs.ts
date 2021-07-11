import { LogBuilder } from '@zougui/logger';
import env from '@zougui/env';
import { transactionContext } from '@zougui/transaction-context';

const scope = env.getScope(__filename);

export interface FetchedPostsLogData {
  posts: string[];
  unseenPosts: string[];
}

export const FetchedPostsLog = new LogBuilder<FetchedPostsLogData>()
  .setCode('e621.posts.fetched')
  .setScope(scope)
  .setTransaction(transactionContext)
  .setTopics(['e621', 'posts', 'http'])
  .setMessage(({ data }) => `${data.posts.length} posts found. ${data.unseenPosts.length} of which were not already seen.`)
  .toClass();

export interface ReachedFailsafeDateLogData {
  date?: string;
}

export const ReachedFailsafeDateLog = new LogBuilder<ReachedFailsafeDateLogData>()
  .setCode('e621.posts.end.failsafe.date')
  .setScope(scope)
  .setTransaction(transactionContext)
  .setTopics(['e621', 'posts'])
  .setMessage('Reached failsafe date')
  .toClass();

export interface ReachedMaxPageLogData {
  maxPage: number;
}

export const ReachedMaxPageLog = new LogBuilder<ReachedMaxPageLogData>()
  .setCode('e621.posts.end.failsafe.maxPage')
  .setScope(scope)
  .setTransaction(transactionContext)
  .setTopics(['e621', 'posts'])
  .setMessage('Reached max page')
  .toClass();


export interface ReachedEndLogData {
  posts: string[];
  unseenPosts: string[];
}

export const ReachedEndLog = new LogBuilder<ReachedEndLogData>()
  .setCode('e621.posts.end')
  .setScope(scope)
  .setTransaction(transactionContext)
  .setTopics(['e621', 'posts'])
  .setMessage('Reached the end of posts')
  .toClass();
