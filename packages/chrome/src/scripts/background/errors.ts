export enum ErrorCode {
  UNKNOWN = -1,
  INVALID_PARAM = -4000,
  NO_PERMISSION = -4003,
  NOT_FOUND = -4004,
  USER_REJECTION = -5000,
}

export class BizError extends Error {
  name: string;
  code: ErrorCode;
  details: Record<string, any>;
  constructor(
    message: string,
    details: Record<string, any> = {},
    name = 'BizError',
    code = ErrorCode.UNKNOWN
  ) {
    super(message);
    this.name = name;
    this.code = code;
    this.details = details;
  }

  toString() {
    return `[${this.name}:${this.code}]: ${this.message}`;
  }
}

export class InvalidParamError extends BizError {
  constructor(message = 'Invalid Parameter', details?: Record<string, any>) {
    super(message, details, InvalidParamError.name, ErrorCode.INVALID_PARAM);
  }
}

export class PortMessageNotAJsonStringError extends InvalidParamError {
  constructor(message = 'port message must be a serialized json object') {
    super('port message must be a serialized json object');
  }
}

export class InvalidPortMessageDataError extends InvalidParamError {
  constructor(message?: string) {
    super('invalid port message data' + (message ? `: ${message}` : ''));
  }
}

export class NoPermissionError extends BizError {
  constructor(message = 'No permission', details?: Record<string, any>) {
    super(message, details, NoPermissionError.name, ErrorCode.NO_PERMISSION);
  }
}

export class UserRejectionError extends BizError {
  constructor(message = 'User rejection', details?: Record<string, any>) {
    super(message, details, UserRejectionError.name, ErrorCode.USER_REJECTION);
  }
}

export class NotFoundError extends BizError {
  constructor(message = 'Resource not found', details?: Record<string, any>) {
    super(message, details, NotFoundError.name, ErrorCode.NOT_FOUND);
  }
}
