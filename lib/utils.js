export const asyncWrapper = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export const validate = (schema, req) => {
  const errors = {};

  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    error.details.forEach((detail) => {
      errors[detail.path] = detail.message;
    });
  }

  return {
    errors: Object.values(errors).length > 0 ? errors : null,
    value,
  };
};
