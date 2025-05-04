const Joi = require("joi");

const categorySchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  description: Joi.string(),
});

module.exports = {
  categorySchema,
};
