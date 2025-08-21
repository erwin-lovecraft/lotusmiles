import { useInfiniteQuery } from '@tanstack/react-query';
import { useMileageLedgersService } from '@/lib/services';
import type { MileageLedgerQueryParams } from '@/types/mileage-ledger';

export const useMileageLedgersInfinite = (baseQueryParams: Omit<MileageLedgerQueryParams, 'page'>) => {
  const { getMileageLedgers } = useMileageLedgersService();

  return useInfiniteQuery({
    queryKey: ['mileage-ledgers-infinite', baseQueryParams],
    queryFn: ({ pageParam = 1 }) => {
      const queryParams: MileageLedgerQueryParams = {
        ...baseQueryParams,
        page: pageParam,
        size: 20, // Smaller page size for better UX
      };
      return getMileageLedgers(queryParams);
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
