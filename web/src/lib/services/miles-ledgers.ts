import { useApiClient } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import type { MilesLedgersResponse, MilesLedgersParams } from '@/types/mileage-ledgers';

export const useMilesLedgers = (params: MilesLedgersParams = {}) => {
  const apiClient = useApiClient();
  const { page = 1, size = 10, date_from, date_to, transaction_id } = params;

  return useQuery({
    queryKey: ['miles-ledgers', page, size, date_from, date_to, transaction_id],
    queryFn: async (): Promise<MilesLedgersResponse> => {
      const searchParams = new URLSearchParams();
      if (page > 1) searchParams.append('page', page.toString());
      if (size !== 10) searchParams.append('size', size.toString());
      if (date_from) searchParams.append('date_from', date_from);
      if (date_to) searchParams.append('date_to', date_to);
      if (transaction_id) searchParams.append('transaction_id', transaction_id);

      const url = `/api/v1/miles-ledgers${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      const response = await apiClient.get(url);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
