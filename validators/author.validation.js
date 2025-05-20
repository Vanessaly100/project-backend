const Joi = require("joi");

const authorSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),

  bio: Joi.string().min(10).required(),

  social_media: Joi.string().uri().allow("", null).optional(),

  contact: Joi.string().max(100).allow("", null).optional(),

  email: Joi.string().email().required(),

  profile_picture: Joi.string().uri().allow("", null).optional(),
});

module.exports = authorSchema;
