import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccrualRequestsService } from '@/lib/services';
import { toast } from 'sonner';
import type { AccrualRequest } from '@/types/accrual-request';

export const useApproveAccrualRequest = () => {
  const queryClient = useQueryClient();
  const { approveAccrualRequest } = useAccrualRequestsService();

  return useMutation({
    mutationFn: (id: string) => approveAccrualRequest(id),
    onMutate: async (id) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['accrual-requests'] });
      await queryClient.cancelQueries({ queryKey: ['accrual-requests-infinite'] });

      // Snapshot the previous value
      const previousAccrualRequests = queryClient.getQueryData(['accrual-requests']);
      const previousAccrualRequestsInfinite = queryClient.getQueryData(['accrual-requests-infinite']);

      // Optimistically update to the new value
      queryClient.setQueryData(['accrual-requests'], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((request: AccrualRequest) =>
            request.id.toString() === id.toString()
              ? {
                  ...request,
                  status: 'approved' as const,
                  reviewer_id: 'current_user', // You might want to get this from auth context
                  reviewed_at: new Date().toISOString(),
                }
              : request
          ),
        };
      });

      // Optimistically update infinite query data
      queryClient.setQueryData(['accrual-requests-infinite'], (old: any) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((request: AccrualRequest) =>
              request.id.toString() === id.toString()
                ? {
                    ...request,
                    status: 'approved' as const,
                    reviewer_id: 'current_user',
                    reviewed_at: new Date().toISOString(),
                  }
                : request
            ),
          })),
        };
      });

      // Return a context object with the snapshotted value
      return { previousAccrualRequests, previousAccrualRequestsInfinite };
    },
    onError: (err, _id, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousAccrualRequests) {
        queryClient.setQueryData(['accrual-requests'], context.previousAccrualRequests);
      }
      if (context?.previousAccrualRequestsInfinite) {
        queryClient.setQueryData(['accrual-requests-infinite'], context.previousAccrualRequestsInfinite);
      }
      console.error('Failed to approve request:', err);
      toast.error('Không thể phê duyệt yêu cầu. Vui lòng thử lại.');
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ['accrual-requests'] });
      queryClient.invalidateQueries({ queryKey: ['accrual-requests-infinite'] });
    },
    onSuccess: () => {
      toast.success('Yêu cầu đã được phê duyệt thành công');
    },
  });
};

export const useRejectAccrualRequest = () => {
  const queryClient = useQueryClient();
  const { rejectAccrualRequest } = useAccrualRequestsService();

  return useMutation({
    mutationFn: ({ id, rejectReason }: { id: string; rejectReason: string }) =>
      rejectAccrualRequest(id, rejectReason),
    onMutate: async ({ id, rejectReason }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['accrual-requests'] });
      await queryClient.cancelQueries({ queryKey: ['accrual-requests-infinite'] });

      // Snapshot the previous value
      const previousAccrualRequests = queryClient.getQueryData(['accrual-requests']);
      const previousAccrualRequestsInfinite = queryClient.getQueryData(['accrual-requests-infinite']);

      // Optimistically update to the new value
      queryClient.setQueryData(['accrual-requests'], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((request: AccrualRequest) =>
            request.id.toString() === id.toString()
              ? {
                  ...request,
                  status: 'rejected' as const,
                  reviewer_id: 'current_user', // You might want to get this from auth context
                  reviewed_at: new Date().toISOString(),
                  rejected_reason: rejectReason,
                }
              : request
          ),
        };
      });

      // Optimistically update infinite query data
      queryClient.setQueryData(['accrual-requests-infinite'], (old: any) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((request: AccrualRequest) =>
              request.id.toString() === id.toString()
                ? {
                    ...request,
                    status: 'rejected' as const,
                    reviewer_id: 'current_user',
                    reviewed_at: new Date().toISOString(),
                    rejected_reason: rejectReason,
                  }
                : request
            ),
          })),
        };
      });

      // Return a context object with the snapshotted value
      return { previousAccrualRequests, previousAccrualRequestsInfinite };
    },
    onError: (err, _variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousAccrualRequests) {
        queryClient.setQueryData(['accrual-requests'], context.previousAccrualRequests);
      }
      if (context?.previousAccrualRequestsInfinite) {
        queryClient.setQueryData(['accrual-requests-infinite'], context.previousAccrualRequestsInfinite);
      }
      console.error('Failed to reject request:', err);
      toast.error('Không thể từ chối yêu cầu. Vui lòng thử lại.');
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ['accrual-requests'] });
      queryClient.invalidateQueries({ queryKey: ['accrual-requests-infinite'] });
    },
    onSuccess: () => {
      toast.success('Yêu cầu đã được từ chối thành công');
    },
  });
};
