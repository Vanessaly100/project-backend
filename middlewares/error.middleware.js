// error-handler.js

const {
  ValidationException,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
  TooManyRequestsException,
} = require("../lib/errors.definitions");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ValidationException) {
    return res.status(err.statusCode || 422).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  if (err instanceof NotFoundException) {
    return res.status(err.statusCode || 404).json({
      message: err.message,
    });
  }

  if (err instanceof InternalServerErrorException) {
    return res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }

  if (err instanceof BadRequestException) {
    return res.status(err.statusCode || 400).json({
      message: err.message,
    });
  }

  if (err instanceof UnauthorizedException) {
    return res.status(err.statusCode || 401).json({
      message: err.message,
    });
  }

  if (err instanceof ForbiddenException) {
    return res.status(err.statusCode || 403).json({
      message: err.message,
    });
  }

  if (err instanceof ConflictException) {
    return res.status(err.statusCode || 409).json({
      message: err.message,
    });
  }

  if (err instanceof TooManyRequestsException) {
    return res.status(err.statusCode || 429).json({
      message: err.message,
    });
  }

  // Catch-all for unexpected errors (Internal Server Error)
  const code = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(code).json({
    success: false,
    message,
    trace: err.stack,
  });
};

module.exports = errorHandler;
