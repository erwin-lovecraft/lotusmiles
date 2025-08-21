import Big from 'big.js';

export interface MileageLedger {
  id: Big;
  customer_id: Big;
  qualifying_miles_delta: number;
  bonus_miles_delta: number;
  accrual_request_id: Big;
  created_at: string;
  updated_at: string;
}

export interface MileageLedgerResponse {
  data: MileageLedger[];
  total: number;
}

export interface MileageLedgerQueryParams {
  customer_id?: string;
  accrual_request_id?: string;
  page?: number;
  size?: number;
}
