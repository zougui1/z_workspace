import Joi from 'joi';

//#region log context
const logContextAppSchema = Joi.object({
  env: Joi.string().default('development'),
  name: Joi.string().min(3).required(),
  file: Joi.string().required(),
  line: Joi.number().positive().integer().min(1),
  functionName: Joi.string().required(),
  nodeVersion: Joi.string().required(),
});

const logContextOsSchema = Joi.object({
  platform: Joi.string().min(3).required(),
  version: Joi.string().min(3).required(),
});

const logContextProcessSchema = Joi.object({
  host: Joi.string().hostname(),
  user: Joi.string().min(3).required(),
  processId: Joi.number().positive().integer(),
});

const logContextSchema = Joi.object({
  app: logContextAppSchema,
  os: logContextOsSchema,
  process: logContextProcessSchema,
});
//#endregion

const logTimeSchema = Joi.object({
  createdAt: Joi.date().required(),
  format: Joi.string().required(),
});

const logProfile = Joi.object({
  label: Joi.string().required(),
  timing: Joi.object({
    formatted: Joi.string().required(),
    milliseconds: Joi.number().positive().required(),
  }),
});

export const logSchema = Joi.object({
  logId: Joi.string().required(),
  level: Joi.string().min(3).required(),
  code: Joi.string().min(3).required(),
  profile: logProfile,
  message: Joi.string().required(),
  topics: Joi.array().items(Joi.string()).required(),
  time: logTimeSchema.required(),
  data: Joi.object().required(),
  context: logContextSchema.required(),
});
