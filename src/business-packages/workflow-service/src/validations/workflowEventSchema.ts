import Joi from 'joi';

const workflowSchema = Joi.object({
  name: Joi.string().required(),
  version: Joi.string().required(),
});

//#region state schema
const stateValueRefName = 'state-value';

const stateValueSchema = Joi.alternatives(
  Joi.string(),
  Joi.object().pattern(/.+/, Joi.link(`#${stateValueRefName}`))
).id(stateValueRefName);

const stateContextSchema = Joi.object({
  machineId: Joi.string().required(),
}).pattern(/.+/, Joi.any());

const stateSchema = Joi.object({
  value: stateValueSchema.required(),
  context: stateContextSchema.required(),
});
//#endregion

const eventSchema = Joi.object({
  type: Joi.string().required(),
  payload: Joi.object().pattern(/.+/, Joi.any()),
}).pattern(/.+/, Joi.any());

export const workflowEventSchema = Joi.object({
  workflow: workflowSchema.required(),
  appName: Joi.string().required(),
  state: stateSchema.required(),
  event: eventSchema.required(),
});
