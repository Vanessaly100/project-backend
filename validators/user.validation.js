const Joi = require("joi");

const userRegistrationSchema = Joi.object({
  first_name: Joi.string().min(2).max(50).required(),
  last_name: Joi.string().min(2).max(50).required(),
  phone_number: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(7)
    .max(15)
    .required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
  profile_picture_url: Joi.string().uri(),
  profilePicturePublicId: Joi.string(),
  location: Joi.string().max(100),
  reading_preferences: Joi.array().items(Joi.string().max(50)),
});

// User Login Schema
const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
});

module.exports = {
  userRegistrationSchema,
  userLoginSchema,
};
