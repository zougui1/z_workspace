import Joi from 'joi';

const browsingSourceData = Joi.object({
  url: Joi.string().uri().required(),
  failsafeDate: Joi.string().isoDate().required(),
});

export const browsingDataSchema = Joi.object({
  lastPosts: Joi.object({
    e621: browsingSourceData.required(),
  }).required(),
});
