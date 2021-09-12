import Joi from 'joi';

export const signupBodySchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().email().required(),
  password: Joi.string().email().required(),
});

export const loginBodySchema = Joi.object({
  email: Joi.string().email().required(),
});

export const signUrlQuerySchema = Joi.object({
  url: Joi.string().uri().required(),
  expiry: Joi.alternatives(Joi.string(), Joi.number()),
});

export const checkSignedUrlQuerySchema = Joi.object({
  expires:Joi.number(),
  url: Joi.string().uri().required(),
  signature: Joi.string().required(),
});
