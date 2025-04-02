const Joi = require("joi");

const reserveBookSchema = Joi.object({
  book_id: Joi.string().uuid().required().messages({
    "string.empty": "Book ID is required.",
    "string.uuid": "Invalid Book ID format.",
  }),
});

module.exports = { reserveBookSchema };
