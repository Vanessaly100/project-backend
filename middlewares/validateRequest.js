const { ValidationException } = require("../lib/errors.definitions");

module.exports = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    throw new ValidationException(
      "Validation failed",
      error.details.map((d) => d.message)
    );
  }

  next();
};
