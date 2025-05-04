const Joi = require("joi");

const authorSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  bio: Joi.string().allow(""),
  social_media: Joi.string().uri().allow(""), 
  contact: Joi.string().max(100).allow(""), 
  email: Joi.string().email().required(),
});

module.exports = {
  authorSchema,
};
