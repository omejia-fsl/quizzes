export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public error?: string,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}
