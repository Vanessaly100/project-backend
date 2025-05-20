
class BadRequestException extends Error {
  constructor(message) {
    super(message);
    this.name = "BadRequestException";
    this.statusCode = 400;
  }
}

class UnauthorizedException extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthorizedException";
    this.statusCode = 401;
  }
}

class ForbiddenException extends Error {
  constructor(message) {
    super(message);
    this.name = "ForbiddenException";
    this.statusCode = 403;
  }
}

class ConflictException extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictException";
    this.statusCode = 409;
  }
}

class NotFoundException extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundException";
    this.statusCode = 404;
  }
}

class TooManyRequestsException extends Error {
  constructor(message) {
    super(message);
    this.name = "TooManyRequestsException";
    this.statusCode = 429;
  }
}

class InternalServerErrorException extends Error {
  constructor(message) {
    super(message);
    this.name = "InternalServerErrorException";
    this.statusCode = 500;
  }
}

class ValidationException extends Error {
  constructor(message = "Validation failed", errors = []) {
    super(message);
    this.name = "ValidationException";
    this.statusCode = 422;
    this.errors = errors;
  }
}


module.exports = {
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
  NotFoundException,
  TooManyRequestsException,
  InternalServerErrorException,
  ValidationException,
};
