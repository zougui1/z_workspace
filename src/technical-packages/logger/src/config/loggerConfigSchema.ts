import Joi from 'joi';
import { LogLevel } from '../enums';

const logLevels = Object.values(LogLevel);

const loggerBaseConfig = {
  levels: Joi.array().items(Joi.string().valid(...logLevels)),
};

const batchSchema = Joi.object({
  interval: Joi.number().positive().integer().required(),
  logCount: Joi.object({
    min: Joi.number().positive().integer().required(),
    max: Joi.number().positive().integer().required(),
  }).required(),
});

//#region loggers' config schema
const loggerConsoleConfigSchema = Joi.alternatives().try(
  Joi.boolean(),
  Joi.object(loggerBaseConfig),
);

const loggerFileConfigSchema = Joi.alternatives().try(
  Joi.boolean(),
  Joi.object({
    ...loggerBaseConfig,
    file: Joi.string().required(),
  }),
);

const loggerDatabaseConfigSchema = Joi.object({
  ...loggerBaseConfig,
  batch: batchSchema.required(),
});

const loggerHttpConfigSchema = Joi.object({
  ...loggerBaseConfig,
  url: Joi.string().required(),
  batch: batchSchema.required(),
});

const loggerEmailConfigSchema = Joi.object({
  ...loggerBaseConfig,
  service: Joi.string().min(3).max(100).required(),
  to: Joi.string().email().required(),
  user: Joi.string().email().required(),
  password: Joi.string().min(3).max(256).required(),
  batch: batchSchema.required(),
});

const loggerDiscordConfigSchema = Joi.object({
  ...loggerBaseConfig,
  server: Joi.string().min(3).max(100).required(),
  category: Joi.string().min(3).max(100),
  channel: Joi.string().min(3).max(100),
  ensureChannel: Joi.boolean(),
  token: Joi.string().min(3).max(150).required(),
});
//#endregion

const loggerCommonConfigSchema = Joi.object({
  date: Joi.object({
    format: Joi.string().required(),
  }).required(),
});

export const loggerConfigSchema = Joi.object({
  common: loggerCommonConfigSchema.required(),

  console: loggerConsoleConfigSchema,
  file: loggerFileConfigSchema,
  database: loggerDatabaseConfigSchema,
  http: loggerHttpConfigSchema,
  email: loggerEmailConfigSchema,
  discord: loggerDiscordConfigSchema,
});
