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

    const response = await apiClient.get<AccrualRequestResponse>(`/api/v1/admin/accrual-requests?${queryParams.toString()}`);

    return response.data;
  };

  const approveAccrualRequest = async (id: string): Promise<void> => {
    console.log('Approving request with ID:', id);
    await apiClient.patch(`/api/v1/admin/accrual-requests/${id}/approve`);
  };

  const rejectAccrualRequest = async (id: string, rejectReason: string): Promise<void> => {
    console.log('Rejecting request with ID:', id);
    await apiClient.patch(`/api/v1/admin/accrual-requests/${id}/reject`, {
      rejected_reason: rejectReason
    });
  };

  return {
    getAccrualRequests,
    approveAccrualRequest,
    rejectAccrualRequest,
  };
};
