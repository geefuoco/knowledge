export class APIError extends Error {
  private _statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this._statusCode = statusCode;
  }

  get statusCode(): number {
    return this._statusCode;
  }
}

export enum APIErrorMessages {
  INVALID_ID = "Invalid id. Id's should be an integer value >= 0.",
  NOT_FOUND = "Resource was not found.",
  SERVER_ERROR = "An internal error on the sever has occured.",
  BAD_REQUEST = "Invalid request. Please check parameters.",
  UNAUTHORIZED = "No credentials were provided to access this resource.",
  FORBIDDEN = "Current user is not authorzied to access this resource.",
  INVALID_CONTENT_LENGTH = "Invalid content length. Max length is 250 characters.",
  INVALID_CREDENTIALS = "Invalid email or password provided",
  INVALID_EMAIL = "Invalid email address. Please use a real email.",
  EMAIL_EXISTS = "The email is already in use. Please use a different email",
  INVALID_PASS_LENGTH = "Password must be at least 6 characters"
}

export enum StatusCodes {
  OK = 200,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  CREATED = 201,
  REDIRECT = 301,
  TOO_MANY_REQUESTS = 429,
  SERVER_ERROR = 500,
  NO_CONTENT = 204
}

function createApiErrors() {
  function createInvalidIdError(): APIError {
    return new APIError(StatusCodes.BAD_REQUEST, APIErrorMessages.INVALID_ID);
  }

  function createNotFoundError() {
    return new APIError(StatusCodes.NOT_FOUND, APIErrorMessages.NOT_FOUND);
  }

  function createServerError(): APIError {
    return new APIError(
      StatusCodes.SERVER_ERROR,
      APIErrorMessages.SERVER_ERROR
    );
  }

  function createInvalidRequestError(): APIError {
    return new APIError(StatusCodes.BAD_REQUEST, APIErrorMessages.BAD_REQUEST);
  }

  function createUnauthorizedError(): APIError {
    return new APIError(
      StatusCodes.UNAUTHORIZED,
      APIErrorMessages.UNAUTHORIZED
    );
  }

  function createForbiddenError(): APIError {
    return new APIError(StatusCodes.FORBIDDEN, APIErrorMessages.FORBIDDEN);
  }

  function createInvalidEmailError(): APIError {
    return new APIError(
      StatusCodes.BAD_REQUEST,
      APIErrorMessages.INVALID_EMAIL
    );
  }

  function createInvalidContentLengthError(): APIError {
    return new APIError(
      StatusCodes.BAD_REQUEST,
      APIErrorMessages.INVALID_CONTENT_LENGTH
    );
  }

  function createInvalidCredentialsError(): APIError {
    return new APIError(
      StatusCodes.UNAUTHORIZED,
      APIErrorMessages.INVALID_CREDENTIALS
    );
  }

  function createUserExistsError(): APIError {
    return new APIError(StatusCodes.BAD_REQUEST, APIErrorMessages.EMAIL_EXISTS);
  }

  function createInvalidPasswordLength(): APIError {
    return new APIError(
      StatusCodes.BAD_REQUEST,
      APIErrorMessages.INVALID_PASS_LENGTH
    );
  }

  function createBadInputError(): APIError {
    return new APIError(StatusCodes.BAD_REQUEST, APIErrorMessages.BAD_REQUEST);
  }

  return Object.freeze({
    createInvalidIdError,
    createNotFoundError,
    createServerError,
    createInvalidRequestError,
    createUnauthorizedError,
    createForbiddenError,
    createInvalidEmailError,
    createInvalidContentLengthError,
    createInvalidCredentialsError,
    createUserExistsError,
    createInvalidPasswordLength,
    createBadInputError
  });
}

export default createApiErrors();
