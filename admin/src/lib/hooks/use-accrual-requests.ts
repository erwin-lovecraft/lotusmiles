import { useQuery } from '@tanstack/react-query';
import { useAccrualRequestsService } from '@/lib/services';
import type { AccrualRequestQueryParams } from '@/types/accrual-request';

export const useAccrualRequests = (queryParams: AccrualRequestQueryParams) => {
  const { getAccrualRequests } = useAccrualRequestsService();

  return useQuery({
    queryKey: ['accrual-requests', queryParams],
    queryFn: () => getAccrualRequests(queryParams),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
