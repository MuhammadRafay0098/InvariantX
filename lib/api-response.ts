export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorDetails {
  [key: string]: unknown;
}

export interface ApiError {
  success: false;

  error: {
    code: string;
    message: string;
    details?: ApiErrorDetails;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export function apiSuccess<T>(data: T, message?: string): ApiSuccess<T> {
  return {
    success: true,
    data,
    ...(message ? { message } : {}),
  };
}

export function apiError(
  code: string,
  message: string,
  details?: ApiErrorDetails,
): ApiError {
  return {
    success: false,

    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  };
}
