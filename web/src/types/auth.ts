export interface OnboardCustomer {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  referrer_code?: string;
}

export interface ApiError extends Error {
  code: string;
  message: string;
  invalid_fields?: Record<string, string>;
}
