import Joi from 'joi';

import { LogLevel, EnvironmentTypes } from '@zougui/log-types';

const logLevels = Object.values(LogLevel);
const environmentTypes = Object.values(EnvironmentTypes);

//#region log context
const logContextAppSchema = Joi.object({
  env: Joi.string().default('development'),
  name: Joi.string().min(3).required(),
  version: Joi.string().min(3).required(),
  file: Joi.string().allow('').required(),
  line: Joi.number().positive().integer().min(1),
  functionName: Joi.string().empty('').default('<anonymous>'),
  nodeVersion: Joi.string(),
});

const logBaseContext = {
  env: Joi.string().valid(...environmentTypes).required(),
  app: logContextAppSchema,
};

//#region node process
const logNodeProcess = Joi.object({
  os: Joi.object({
    platform: Joi.string().required(),
    version: Joi.string().required(),
  }).required(),
  nodeVersion: Joi.string().required(),
  host: Joi.string(),
  user: Joi.string().required(),
  processId: Joi.number().positive().integer(),
});
//#endregion

//#region browser process
const logBrowserProcess = Joi.object({
  os: Joi.object({
    platform: Joi.string().required(),
  }).required(),
  host: Joi.string().required(),
  userAgent: Joi.string().required(),
  language: Joi.string().required(),
  languages: Joi.array().items(Joi.string()).required(),
});
//#endregion

const logContextSchema = Joi.alternatives().try(
  Joi.object({
    ...logBaseContext,
    env: Joi.string().valid(EnvironmentTypes.node).required(),
    process: logNodeProcess,
  }),
  Joi.object({
    ...logBaseContext,
    env: Joi.string().valid(EnvironmentTypes.browser).required(),
    process: logBrowserProcess,
  }),
  Joi.object(logBaseContext),
);
//#endregion

const taskRefName = 'log-task';
const taskSchema = Joi.object({
  id: Joi.string().required(),

  timing: Joi.object({
    formatted: Joi.string().required(),
    milliseconds: Joi.number().positive().required(),
  }),

  subTasks: Joi.array().items(Joi.link(`#${taskRefName}`)),
}).id(taskRefName);

//#region log transaction
const transactionTimeSchema = Joi.object({
  startedAt: Joi.date().required(),
  finishedAt: Joi.date(),
});

const transactionSchema = Joi.object({
  id: Joi.string().required(),
  topics: Joi.array().items(Joi.string()).required(),
  data: Joi.object().required(),
  time: transactionTimeSchema.required(),
});
//#endregion

export const logSchema = Joi.object({
  logId: Joi.string().required(),
  level: Joi.string().valid(...logLevels).required(),
  code: Joi.string().min(3).required(),
  task: taskSchema,
  topics: Joi.array().items(Joi.string()).required(),
  message: Joi.string().required(),
  namespace: Joi.string().required(),
  transaction: transactionSchema,
  createdAt: Joi.date().required(),
  data: Joi.object().required(),
  version: Joi.string().required(),
  context: logContextSchema.required(),
});
