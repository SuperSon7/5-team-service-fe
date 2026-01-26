export type ApiResponse<T> = {
  code: string;
  message: string;
  data: T;
};

export type ApiErrorResponse = {
  code: string;
  message: string;
};

export type ApiFetchOptions = RequestInit & {
  timeoutMs?: number;
  retried?: boolean;
  skipRefresh?: boolean;
};
