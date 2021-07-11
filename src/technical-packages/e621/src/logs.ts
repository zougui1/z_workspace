import { LogBuilder } from '@zougui/logger';
import env from '@zougui/env';

const scope = env.getScope(__filename);

export interface FilteredPostsLogData {
  posts: {
    url: string;
    filters: { includes?: string[]; excludes?: string[]; }[]
  }[];
}

export const FilteredPostsLog = new LogBuilder<FilteredPostsLogData>()
  .setCode('e621.posts.filtered')
  .setScope(scope)
  .setTopics(['e621', 'posts'])
  .setMessage(({ data }) => `${data.posts.length} have been filtered out.`)
  .toClass();
