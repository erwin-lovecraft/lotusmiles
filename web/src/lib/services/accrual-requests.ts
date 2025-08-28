import { useApiClient } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import type { MileageAccrualRequest } from '@/types/mileage-accrual-request';

export interface AccrualRequestsResponse {
  data: MileageAccrualRequest[];
  total: number;
}

export interface AccrualRequestsParams {
  page?: number;
  size?: number;
  keyword?: string;
}

export const useAccrualRequests = (params: AccrualRequestsParams = {}) => {
  const apiClient = useApiClient();
  const { page = 1, size = 5, keyword = '' } = params;

  return useQuery({
    queryKey: ['accrual-requests', page, size, keyword],
    queryFn: async (): Promise<AccrualRequestsResponse> => {
      const searchParams = new URLSearchParams();
      if (page > 1) searchParams.append('page', page.toString());
      if (size !== 5) searchParams.append('size', size.toString());
      if (keyword) searchParams.append('keyword', keyword);

      const url = `/api/v2/accrual-requests${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      const response = await apiClient.get(url);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
