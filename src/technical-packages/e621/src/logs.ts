import { Log } from '@zougui/logger';

import { Post } from './Post';

export interface FilteredPostsLogData {
  posts: {
    data: Post;
    filters: { includes?: string[]; excludes?: string[]; }[]
  }[];
}

export const FilteredPostsLog = new Log<FilteredPostsLogData>()
  .setCode('e621.posts.filtered')
  .setTopics(['e621', 'posts'])
  .setMessage(({ data }) => `${data.posts.length} have been filtered out.`)
  .toClass();
