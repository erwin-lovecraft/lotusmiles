export interface AccrualRequest {
  id: number;
  customer_id: number;
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
  reviewer_id: number | null;
  reviewed_at: string | null;
  rejected_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface AccrualRequestResponse {
  data: AccrualRequest[];
  total: number;
}

export interface AccrualRequestQueryParams {
  keyword?: string;
  status?: string;
  submitted_date?: string;
  page?: number;
  size?: number;
}
