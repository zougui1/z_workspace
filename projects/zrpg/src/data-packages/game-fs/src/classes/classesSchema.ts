import Joi from 'joi';

const statsSchema = Joi.object({
  health: Joi.number().integer().min(0).required(),
  mana: Joi.number().integer().min(0).required(),
  strength: Joi.number().integer().min(0).required(),
  resistance: Joi.number().integer().min(0).required(),
  magicalMight: Joi.number().integer().min(0).required(),
  magicalMending: Joi.number().integer().min(0).required(),
  agility: Joi.number().integer().min(0).required(),
  deftness: Joi.number().integer().min(0).required(),
});

const classAvailableSchema = Joi.alternatives().try(
  Joi.string().valid('always'),
  Joi.object({
    type: Joi.string().valid('quest').required(),
    id: Joi.number().integer().min(0).required(),
  }),
);

const validClassSchema = Joi.object({
  id: Joi.string().required(),
  className: Joi.string().required(),
  branch: Joi.string().required(),
  stats: statsSchema.required(),
  available: classAvailableSchema.required(),
  equipables: Joi.array().items(Joi.string()).required(),
});

const todoClassSchema = Joi.object({
  status: Joi.string().valid('todo'),
}).unknown(true);

const classSchema = Joi.alternatives().try(validClassSchema, todoClassSchema);

export const classesSchema = Joi.object({
  data: Joi.array().items(classSchema.required()).required(),
});
