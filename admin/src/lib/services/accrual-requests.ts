import { useApiClient } from '@/lib/api';
import type { AccrualRequestResponse, AccrualRequestQueryParams } from '@/types/accrual-request';

export const useAccrualRequestsService = () => {
  const apiClient = useApiClient();

  const getAccrualRequests = async (params: AccrualRequestQueryParams): Promise<AccrualRequestResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params.keyword) {
      queryParams.append('keyword', params.keyword);
    }
    if (params.status) {
      queryParams.append('status', params.status);
    }
    if (params.submitted_date) {
      queryParams.append('submitted_date', params.submitted_date);
    }
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params.size) {
      queryParams.append('size', params.size.toString());
    }

    const response = await apiClient.get(`/api/v1/admin/accrual-requests?${queryParams.toString()}`);
    return response.data;
  };

  return {
    getAccrualRequests,
  };
};
