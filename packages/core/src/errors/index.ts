export enum ErrorCode {
  UNKNOWN = -1,
  RPC_ERROR = -5000,
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

export class RpcError extends BizError {
  constructor(message: string, details: Record<string, any> = {}) {
    super(message, details, 'RpcError', ErrorCode.RPC_ERROR);
  }
}
