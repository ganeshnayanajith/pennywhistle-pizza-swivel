export const API = {
  BASE_PATH: '/api',
};

export const HTTP_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  SERVER_ERROR: 500,
};

export const ERRORS = {
  SERVER_ERROR: 'ServerError',
  VALIDATION_ERROR: 'ValidationError',
  AUTHENTICATION_ERROR: 'AuthenticationFailError',
  AUTHORIZATION_ERROR: 'AuthorizationFailError',
  FORBIDDEN_ERROR: 'ForbiddenError',
  NOT_FOUND_ERROR: 'NotFoundError',
  UNPROCESSABLE_ENTITY_ERROR: 'UnprocessableEntityError',
  BAD_REQUEST_ERROR: 'BadRequestError',
};

export const MESSAGES = {
  SOMETHING_WENT_WRONG: 'Something went wrong',
};

export const SALT_ROUNDS = 10;
