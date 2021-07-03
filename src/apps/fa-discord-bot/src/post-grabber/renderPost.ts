import { Post } from '@zougui/e621';
import { preventEmbed } from '@zougui/discord';

import { IDiscordConfig, RenderPostConfig, IRenderSource, IRenderKeywords, IRenderRawImage } from '../discord-config';

export const renderPost = (post: Post, renderConfig: RenderPostConfig, config: IDiscordConfig): string => {
  switch (renderConfig.type) {
    case 'source': return renderSource(post, renderConfig);
    case 'keywords': return renderKeywords(post, renderConfig, config);
    case 'raw-image': return renderRawImage(post, renderConfig);
    default: return '';
  }
}

const renderSource = (post: Post, renderConfig: IRenderSource): string => {
  const url = renderConfig.embed ? post.url : preventEmbed(post.url);
  return `Source: ${url}`;
}

const renderKeywords = (post: Post, renderConfig: IRenderKeywords, config: IDiscordConfig): string => {
  const keywords = config.includes?.keywords;

  if (!keywords) {
    return '';
  }

  return post.tags.all
    .filter(tag => keywords.includes(tag))
    .map(tag => tag.replace(/_/g, ''))
    .join(', ');
}

const renderRawImage = (post: Post, renderConfig: IRenderRawImage): string => {
  const image = renderConfig.embed ? post.file.url : preventEmbed(post.file.url);
  return image;
}
