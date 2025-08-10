import type { User as Auth0User } from "@auth0/auth0-react";

export interface User extends Auth0User {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface OnboardingData {
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  referrer_code?: string;
}

export interface ApiError {
  code: string;
  message: string;
  fields?: Record<string, string[]>;
}

export interface CustomerProfile {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  address?: string
  referrer_code?: string
  onboarded: boolean
  created_at: string
  updated_at: string
}

export interface ProfileResponse {
  success: boolean
  data: CustomerProfile
}

export interface OnboardResponse {
  success: boolean
  message: string
  data?: CustomerProfile
}
