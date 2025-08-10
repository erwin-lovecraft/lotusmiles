export interface ApiError extends Error {
  code: string;
  message: string;
  invalid_fields?: Record<string, string>;
}
