export interface ApiError {
  code: string;
  message: string;
  invalid_fields?: Record<string, string>;
}
