import { PostTypes, Ratings, RenderPostTypes } from '../enums';

export interface IRenderSource {
  type: RenderPostTypes.source;
  embed?: boolean;
}

export interface IRenderKeywords {
  type: RenderPostTypes.keywords;
}

export interface IRenderRawImage {
  type: RenderPostTypes.rawImage;
  embed?: boolean;
}

export type RenderPostConfig = IRenderSource | IRenderKeywords | IRenderRawImage;

export interface IDiscordConfig {
  types: PostTypes[];
  ratings: Ratings[];

  includes?: {
    keywords?: string[];
  };

  excludes?: {
    keywords?: string[];
    when: { included?: string[]; excluded?: string[] }[]
  };

  renderPost: RenderPostConfig[];
}
