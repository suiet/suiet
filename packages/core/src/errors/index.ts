export enum ErrorCode {
  UNKNOWN = -1,
  NO_AUTH = -4001,
  RPC_ERROR = -5000,
  DB_ERROR = -6000,
  META_MISSING_ERROR = -6001,
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
    return `${this.message} | (${this.name}:${this.code})`;
  }
}

export class RpcError extends BizError {
  constructor(message: string, details: Record<string, any> = {}) {
    super(message, details, 'RpcError', ErrorCode.RPC_ERROR);
  }
}

export class DbError extends BizError {
  constructor(
    message: string = 'database error',
    details: Record<string, any> = {},
    errorCord: ErrorCode = ErrorCode.DB_ERROR
  ) {
    super(message, details, 'DbError', errorCord);
  }
}

export class MetadataMissingError extends DbError {
  constructor(
    message: string = 'metadata is missing',
    details: Record<string, any> = {}
  ) {
    super(message, details, ErrorCode.META_MISSING_ERROR);
  }
}

export class NoAuthError extends BizError {
  constructor(
    message = 'Authentication failed',
    details?: Record<string, any>
  ) {
    super(message, details, NoAuthError.name, ErrorCode.NO_AUTH);
  }
}
