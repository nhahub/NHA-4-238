export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
  statusCode: number;
};

// Enhanced error class for better error handling in components
export class ApiError extends Error {
  public statusCode: number;
  public errors: string[];

  constructor(message: string, statusCode: number = 0, errors: string[] = []) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}