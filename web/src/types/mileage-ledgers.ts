export type MileageTransaction = {
  id: string;
  customer_id: string;
  qualifying_miles_delta: number;
  bonus_miles_delta: number;
  accrual_request_id: string;
  created_at: string;
  updated_at: string;
}

export interface MilesLedgersResponse {
  data: MileageTransaction[];
  total: number;
}

export interface MilesLedgersParams {
  page?: number;
  size?: number;
  date_from?: string;
  date_to?: string;
  transaction_id?: string;
}
