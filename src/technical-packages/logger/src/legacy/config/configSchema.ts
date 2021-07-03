import Joi from 'joi';
import { LogLevel } from '../LogLevel';

const reFullHexColor = /^#(?:[0-9a-f]{6})$/i;

const colorSchema = Joi.string().pattern(reFullHexColor, { name: 'Full hex color' });
const logLevels = Object.values(LogLevel);

const logLevelSchema = Joi.object({
  color: colorSchema.required(),
});

const logLevelOverrideSchema = Joi.object({
  color: colorSchema,
});

const transportLevelsSchema = Joi.array().items(Joi.string().valid(...logLevels));

const levelsOverrides = logLevels.reduce((overrides, level) => {
  overrides[level] = logLevelOverrideSchema;
  return overrides;
}, {} as Record<LogLevel, typeof logLevelOverrideSchema>);

const transportLogsOverridesSchema = {
  ...levelsOverrides,
  levels: transportLevelsSchema,
};

const levels = logLevels.reduce((overrides, level) => {
  overrides[level] = logLevelSchema;
  return overrides;
}, {} as Record<LogLevel, typeof logLevelSchema>);

export const loggerConfigSchema = Joi.object({
  levels: Joi.object(levels).required(),

  transports: Joi.object({
    console: Joi.object(transportLogsOverridesSchema).required(),
    file: Joi.object({
      ...transportLogsOverridesSchema,
      dir: Joi.string().required(),
    }).required(),
    discord: Joi.object({
      ...transportLogsOverridesSchema,
      server: Joi.string().min(3).max(100).required(),
      token: Joi.string().min(3).max(150).required(),
    }).required(),
    email: Joi.object({
      ...transportLogsOverridesSchema,
      service: Joi.string().min(3).max(100).required(),
      to: Joi.string().email().required(),
      user: Joi.string().email().required(),
      password: Joi.string().min(3).max(256).required(),
    }).required(),
  }),
}).required();
