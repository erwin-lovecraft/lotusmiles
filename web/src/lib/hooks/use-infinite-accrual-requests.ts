import { useApiClient } from '@/lib/api';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { MileageAccrualRequest } from '@/types/mileage-accrual-request';

export interface AccrualRequestsResponse {
  data: MileageAccrualRequest[];
  total: number;
}

export interface AccrualRequestsParams {
  keyword?: string;
}

export const useInfiniteAccrualRequests = (params: AccrualRequestsParams = {}) => {
  const apiClient = useApiClient();
  const { keyword = '' } = params;
  const pageSize = 5;

  return useInfiniteQuery({
    queryKey: ['infinite-accrual-requests', keyword],
    queryFn: async ({ pageParam = 1 }): Promise<AccrualRequestsResponse> => {
      const searchParams = new URLSearchParams();
      searchParams.append('page', pageParam.toString());
      searchParams.append('size', pageSize.toString());
      if (keyword) searchParams.append('keyword', keyword);

      const url = `/api/v1/accrual-requests?${searchParams.toString()}`;
      const response = await apiClient.get(url);
      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.ceil(lastPage.total / pageSize);
      const nextPage = allPages.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
