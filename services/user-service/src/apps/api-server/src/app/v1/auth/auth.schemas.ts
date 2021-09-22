import Joi from 'joi';

//#region signup schemas
export const signupBodySchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
//#endregion

//#region login shcemas
export const loginBodySchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
//#endregion

//#region authorize schemas
const subjectSchema = Joi.alternatives(
  Joi.string(),
  Joi.object({
    __typename: Joi.string().required(),
  }).unknown(),
);

const ruleSchema = Joi.object({
  type: Joi.string().valid('can', 'cannot').required(),
  action: Joi.string().required(),
  subject: subjectSchema.required(),
  field: Joi.string(),
});

export const authorizeBodySchema = Joi.object({
  rules: Joi.array().items(ruleSchema).required(),
});
//#endregion

//#region sign URL schemas
export const signUrlQuerySchema = Joi.object({
  url: Joi.string().uri().required(),
  expiry: Joi.alternatives(Joi.string(), Joi.number()),
});
//#endregion

//#region check signed URL schemas
export const checkSignedUrlQuerySchema = Joi.object({
  expires:Joi.number(),
  url: Joi.string().uri().required(),
  signature: Joi.string().required(),
});
//#endregion
