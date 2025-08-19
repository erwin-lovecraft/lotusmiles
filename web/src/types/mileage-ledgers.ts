export type MileageTransaction = {
  id: bigint;
  member_id: bigint;
  qualifying_miles_delta: number;
  bonus_miles_delta: number;
  accrual_request_id: bigint;
  created_at: Date;
}
