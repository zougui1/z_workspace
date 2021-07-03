import { Post as E621Post } from 'e621';

import { E621Ratings } from './E621Ratings';
import { WEBSITE_URL } from './constants';

export class Post {

  id: number;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  file: PostFile;
  preview: PostPreview;
  sample: PostSample;
  score: PostScore;
  tags: Record<'general' | 'species' | 'character' | 'copyright' | 'artist' | 'invalid' | 'lore' | 'meta' | 'all', Array<string>>;
  lockedTags: Array<string>;
  changeSeq: number;
  flags: Record<'pending' | 'flagged' | 'note_locked' | 'status_locked' | 'rating_locked' | 'deleted', boolean>;
  rating: E621Ratings;
  favCount: number;
  sources: Array<string>;
  pools: Array<number>;
  relationships: PostRelationships;
  approverId: number | null;
  uploaderId: number | null;
  description: string;
  commentCount: number;
  isFavorited: boolean;
  hasNotes: boolean;
  duration: number | null;

  constructor(post: E621Post) {
    this.id = post.id;
    this.url = `${WEBSITE_URL}/posts/${this.id}`;
    this.createdAt = new Date(post.created_at);
    this.updatedAt = new Date(post.updated_at);
    this.file = post.file;
    this.preview = post.preview;
    this.sample = post.sample;
    this.score = post.score;
    this.tags = {
      ...post.tags,
      all: Object.values(post.tags).flat(),
    };
    this.lockedTags = post.locked_tags;
    this.changeSeq = post.change_seq;
    this.flags = post.flags;
    this.favCount = post.fav_count;
    this.sources = post.sources;
    this.pools = post.pools;
    this.relationships = {
      children: post.relationships.children,
      hasActiveChildren: post.relationships.has_active_children,
      hasChildren: post.relationships.has_children,
      parentId: post.relationships.parent_id,
    };
    this.approverId = post.approver_id;
    this.uploaderId = post.uploader_id;
    this.description = post.description;
    this.commentCount = post.comment_count;
    this.isFavorited = post.is_favorited;
    this.hasNotes = post.has_notes;
    this.duration = post.duration;

    switch (post.rating) {
      case 'e':
        this.rating = E621Ratings.explicit;
        break;
      case 'q':
        this.rating = E621Ratings.questionable;
        break;
      case 's':
        this.rating = E621Ratings.safe;
        break;
    }
  }
}

type PostFile = {
  width: number;
  height: number;
  ext: string;
  md5: string;
  url: string;
}

type PostPreview = {
  width: number;
  height: number;
  url: string;
}

type PostSample = {
  has: boolean;
  height: number;
  width: number;
  url: string;
  alternates: Record<string, unknown>;
}

type PostScore = {
  up: number;
  down: number;
  total: number;
}

type PostRelationships = {
  parentId: number | null;
  hasChildren: boolean;
  hasActiveChildren: boolean;
  children: Array<number>;
}
