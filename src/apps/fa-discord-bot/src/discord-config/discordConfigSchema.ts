import Joi from 'joi';

import { PostTypes, Ratings, RenderPostTypes } from '../enums';

const postTypes = Object.values(PostTypes);
const ratings = Object.values(Ratings);

const renderSourceSchema = Joi.object({
  type: Joi.string().valid(RenderPostTypes.source).required(),
  embed: Joi.boolean(),
});

const renderKeywordsSchema = Joi.object({
  type: Joi.string().valid(RenderPostTypes.keywords).required(),
});

const renderRawImageSchema = Joi.object({
  type: Joi.string().valid(RenderPostTypes.rawImage).required(),
  embed: Joi.boolean(),
});

export const discordConfigSchema = Joi.object({
  types: Joi.array().items(Joi.string().valid(...postTypes)).min(1).required(),
  ratings: Joi.array().items(Joi.string().valid(...ratings)).min(1).required(),

  includes: Joi.object({
    keywords: Joi.array().items(Joi.string()).required(),
  }),

  excludes: Joi.object({
    keywords: Joi.array().items(Joi.string()),
    when: Joi.array().items(Joi.object({
      includes: Joi.array().items(Joi.string()),
      excludes: Joi.array().items(Joi.string()),
    })),
  }),

  renderPost: Joi.array().items(Joi.alternatives().try(
    renderSourceSchema,
    renderKeywordsSchema,
    renderRawImageSchema,
  )).min(1).required(),
});
