import Joi from 'joi';
import { loggerConfigSchema } from '@zougui/logger';

const durationSchema = Joi.alternatives().try(
  Joi.string().min(1),
  Joi.number().integer().positive(),
);

const discordSchema = Joi.object({
  token: Joi.string().min(10).required(),
  prefix: Joi.string().min(1).max(10).required(),
  loginTimeout: durationSchema.required(),
});

const browseSchema = Joi.object({
  fetchSubmissionInterval: durationSchema.required(),
  on: Joi.object({
    interval: durationSchema.required(),
    boot: Joi.boolean(),
  }),
  sources: Joi.object({
    e621: Joi.object({
      username: Joi.string().min(3).max(100).required(),
      apiKey: Joi.string().min(3).required(),
    }).required(),
  }).required(),
});

const downloadSchema = Joi.object({
  baseDir: Joi.string().min(3),
});

export const configSchema = Joi.object({
  dateFormat: Joi.string().required(),
  browse: browseSchema.required(),
  download: downloadSchema.required(),
  logs: loggerConfigSchema.required(),
  discord: discordSchema.required(),
});
