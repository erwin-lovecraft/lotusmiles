import { useApiClient } from '@/lib/api';
import type { AccrualRequestResponse, AccrualRequestQueryParams } from '@/types/accrual-request';
import Big from 'big.js';

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

    const response = await apiClient.get<AccrualRequestResponse>(`/api/v1/admin/accrual-requests?${queryParams.toString()}`);

    console.log(response.data)

    return response.data;
  };

  const approveAccrualRequest = async (id: Big): Promise<void> => {
    console.log('Approving request with ID:', id.toString());
    await apiClient.patch(`/api/v1/admin/accrual-requests/${id.toString()}/approve`);
  };

  const rejectAccrualRequest = async (id: Big, rejectReason: string): Promise<void> => {
    console.log('Rejecting request with ID:', id.toString());
    await apiClient.patch(`/api/v1/admin/accrual-requests/${id.toString()}/reject`, {
      rejected_reason: rejectReason
    });
  };

  return {
    getAccrualRequests,
    approveAccrualRequest,
    rejectAccrualRequest,
  };
};
