export type ApiResponse<T> = {
  code: string;
  message: string;
  data: T;
};

export type ApiError = {
  code: string;
  message: string;
};
