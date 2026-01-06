export class AppError extends Error {
  public statusCode: number;
  public code: string;

  constructor(
    statusCode: number = 500,
    message: string,
    isOperational: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}
