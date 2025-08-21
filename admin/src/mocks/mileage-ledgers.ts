import Big from 'big.js';
import type { MileageLedger } from '@/types/mileage-ledger';

// Mock mileage ledger data based on the API response structure
export const mockMileageLedgers: MileageLedger[] = [
  {
    id: new Big('245242388946092552'),
    customer_id: new Big('245241128171864584'),
    qualifying_miles_delta: 1442,
    bonus_miles_delta: 1802,
    accrual_request_id: new Big('245241133272138248'),
    created_at: '2025-08-20T03:24:14.776354+07:00',
    updated_at: '2025-08-20T03:24:14.774231+07:00',
  },
  {
    id: new Big('245477502435197448'),
    customer_id: new Big('245241128171864584'),
    qualifying_miles_delta: 793,
    bonus_miles_delta: 1009,
    accrual_request_id: new Big('245373904032367112'),
    created_at: '2025-08-21T18:19:53.337832+07:00',
    updated_at: '2025-08-21T18:19:53.334845+07:00',
  },
  {
    id: new Big('245483016837661192'),
    customer_id: new Big('245241128171864584'),
    qualifying_miles_delta: 600,
    bonus_miles_delta: 655,
    accrual_request_id: new Big('245373904032367322'),
    created_at: '2025-08-21T19:14:40.183906+07:00',
    updated_at: '2025-08-21T19:14:40.180118+07:00',
  },
  {
    id: new Big('245483016837661193'),
    customer_id: new Big('245241128171864585'),
    qualifying_miles_delta: 1250,
    bonus_miles_delta: 1500,
    accrual_request_id: new Big('245373904032367323'),
    created_at: '2025-08-22T10:30:15.123456+07:00',
    updated_at: '2025-08-22T10:30:15.123456+07:00',
  },
  {
    id: new Big('245483016837661194'),
    customer_id: new Big('245241128171864586'),
    qualifying_miles_delta: 800,
    bonus_miles_delta: 960,
    accrual_request_id: new Big('245373904032367324'),
    created_at: '2025-08-22T14:45:22.654321+07:00',
    updated_at: '2025-08-22T14:45:22.654321+07:00',
  },
];

// Mock response structure matching the API
export const mockMileageLedgerResponse = {
  data: mockMileageLedgers,
  total: mockMileageLedgers.length,
};
