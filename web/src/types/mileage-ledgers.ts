export type MileageTransaction = {
  id: bigint;
  customer_id: bigint;
  qualifying_miles_delta: number;
  bonus_miles_delta: number;
  accrual_request_id: bigint;
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
