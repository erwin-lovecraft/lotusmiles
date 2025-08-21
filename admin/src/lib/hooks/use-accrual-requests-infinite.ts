import { useInfiniteQuery } from '@tanstack/react-query';
import { useAccrualRequestsService } from '@/lib/services';
import type { AccrualRequestQueryParams } from '@/types/accrual-request';

export const useAccrualRequestsInfinite = (baseQueryParams: Omit<AccrualRequestQueryParams, 'page'>) => {
  const { getAccrualRequests } = useAccrualRequestsService();

  return useInfiniteQuery({
    queryKey: ['accrual-requests-infinite', baseQueryParams],
    queryFn: ({ pageParam = 1 }) => {
      const queryParams: AccrualRequestQueryParams = {
        ...baseQueryParams,
        page: pageParam,
        size: 20, // Smaller page size for better UX
      };
      return getAccrualRequests(queryParams);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;
      const totalPages = Math.ceil(lastPage.total / 20);
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
