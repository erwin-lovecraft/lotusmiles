import { useApiClient } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import type { Profile } from '@/types/profile';

export const useProfile = () => {
  const apiClient = useApiClient();

  return useQuery({
    queryKey: ['profile'],
    queryFn: async (): Promise<Profile> => {
      const response = await apiClient.get('/api/v2/profile');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
