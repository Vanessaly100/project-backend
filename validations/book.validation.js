const Joi = require("joi");

const bookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  description: Joi.string().required(),
  genre: Joi.string().required(),
  coverImage: Joi.string().uri().optional(),
  stock: Joi.number().integer().min(1).required(),
});

module.exports = bookSchema;
