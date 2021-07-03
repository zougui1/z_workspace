import _E621 from 'e621';
import { inRange } from '@zougui/utils';
import { logger } from '@zougui/logger';

import { E621Ratings } from './E621Ratings';
import { FilteredPostsLog } from './logs';
import { Post } from './Post';

//const DEFAULT_LIMIT = 5//0;
const DEFAULT_LIMIT = 75;
const MIN_LIMIT = 1;
const MAX_LIMIT = 320;
const DEFAULT_PAGE = 1;
const MIN_PAGE = 1;

export class E621 {

  protected _e621: _E621;

  constructor(options: E621Options) {
    this._e621 = new _E621(options.username, options.apiKey);
  }

  async getPosts(options: GetPostsOptions = {}): Promise<Post[]> {
    const limit = options?.limit ?? DEFAULT_LIMIT;
    const page = options?.page ?? DEFAULT_PAGE;

    if (!inRange(limit, MIN_LIMIT, MAX_LIMIT)) {
      throw new Error(`The limit must be greater than or equal to ${MIN_LIMIT} and less than or equal to ${MAX_LIMIT}; Got ${limit}.`);
    }

    if (page < MIN_PAGE) {
      throw new Error(`The page must be greater than or equal to ${MIN_PAGE}; Got ${page}.`);
    }

    const includeKeywords: string[] = options.includes?.keywords ?? [];
    const includeRating: E621Ratings[] = options.includes?.rating ? [options.includes.rating] : [];
    const excludeKeywords: string[] = options.excludes?.keywords ?? [];
    const excludeRating: E621Ratings[] = options.excludes?.ratings ?? [];

    const tags = [
      ...includeKeywords,
      ...excludeKeywords.map(keyword => `-${keyword}`),
      ...includeRating.map(rating => `rating:${rating}`),
      ...excludeRating.map(rating => `-rating:${rating}`),
    ];

    console.log('search', tags.join(' '))

    const e621Posts = await this._e621.getPosts(tags, limit, page);
    const posts = e621Posts.map(post => new Post(post));
    const when = options.excludes?.when;

    if (!when) {
      return posts;
    }

    const filteredPosts = posts.filter(post => {
      return when.every(when => this.takeWhen(post, when));
    });

    if (filteredPosts.length !== posts.length) {
      const filteredOutPosts = posts.filter(post => filteredPosts.every(p => post.url !== p.url));
      const postsWithFilters = filteredOutPosts.map(post => {
        const filters = when.filter(when => !this.takeWhen(post, when));

        return {
          data: post,
          filters,
        };
      });

      logger.info(new FilteredPostsLog({ posts: postsWithFilters }));
    }

    return filteredPosts;
  }

  //#region private
  private takeWhen(post: Post, when: { includes?: string[]; excludes?: string[]; }): boolean {
    const whenIncludes = when.includes ?? [];
    const whenExcludes = when.excludes ?? [];

    return !(whenIncludes.every(tag => post.tags.all.includes(tag)) && whenExcludes.every(tag => !post.tags.all.includes(tag)));
  }
  //#endregion
}

export interface E621Options {
  username: string;
  apiKey: string;
}

export interface GetPostsOptions {
  includes?: {
    keywords?: string[];
    rating?: E621Ratings;
  };
  excludes?: {
    keywords?: string[];
    ratings?: E621Ratings[];
    when?: { includes?: string[]; excludes?: string[]; }[];
  };
  limit?: number;
  page?: number;
}
