import { useApiClient } from '@/lib/api';
import type { MileageLedgerResponse, MileageLedgerQueryParams } from '@/types/mileage-ledger';

export const useMileageLedgersService = () => {
  const apiClient = useApiClient();

  const getMileageLedgers = async (params: MileageLedgerQueryParams): Promise<MileageLedgerResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params.customer_id) {
      queryParams.append('customer_id', params.customer_id);
    }
    if (params.accrual_request_id) {
      queryParams.append('accrual_request_id', params.accrual_request_id);
    }
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params.size) {
      queryParams.append('size', params.size.toString());
    }

    const response = await apiClient.get<MileageLedgerResponse>(`/api/v1/admin/miles-ledgers?${queryParams.toString()}`);

    return response.data;
  };

  return {
    getMileageLedgers,
  };
};
