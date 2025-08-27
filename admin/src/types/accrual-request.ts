export interface Customer {
  id: string;
  qualifying_miles_total: number;
  bonus_miles_total: number;
  member_tier: string;
  auth0_user_id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
}

export interface AccrualRequest {
  id: string;
  customer_id: string;
  status: 'pending' | 'inprogress' | 'approved' | 'rejected';
  ticket_id: string;
  pnr: string;
  carrier: string;
  booking_class: string;
  from_code: string;
  to_code: string;
  departure_date: string;
  ticket_image_url: string;
  boarding_pass_image_url: string;
  distance_miles: number;
  qualifying_accrual_rate: number;
  qualifying_miles: number;
  bonus_accrual_rate: number;
  bonus_miles: number;
  reviewer_id: string | null;
  reviewed_at: string | null;
  rejected_reason: string | null;
  created_at: string;
  updated_at: string;
  customer: Customer;
}

export interface AccrualRequestResponse {
  data: AccrualRequest[];
  total: number;
}

export interface AccrualRequestQueryParams {
  keyword?: string;
  status?: string;
  submitted_date?: string;
  customer_email?: string;
  member_tier?: string;
  page?: number;
  size?: number;
}
