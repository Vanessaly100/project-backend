const Joi = require("joi");

const bookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  category: Joi.string().required(),
  description: Joi.string().optional(),
  cover_url: Joi.string().uri().required(),
  publishedYear: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .optional(),
  totalCopies: Joi.number().integer().min(0).required(),
  availableCopies: Joi.number().integer().min(0).required(),
  // isAvailable: Joi.boolean().required(),
  genres: Joi.array().items(Joi.string()).optional(),
});

module.exports = bookSchema; 
