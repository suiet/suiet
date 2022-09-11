export class PortMessageNotAJsonStringError extends Error {
  constructor() {
    super('port message must be a serialized json object');
  }
}

export class InvalidPortMessageDataError extends Error {
  constructor(message?: string) {
    super('invalid port message data' + (message ? `: ${message}` : ''));
  }
}
