import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccrualRequestsService } from '@/lib/services';
import { toast } from 'sonner';
import Big from 'big.js';

export const useApproveAccrualRequest = () => {
  const queryClient = useQueryClient();
  const { approveAccrualRequest } = useAccrualRequestsService();

  return useMutation({
    mutationFn: (id: Big) => approveAccrualRequest(id),
    onSuccess: () => {
      // Invalidate and refetch accrual requests
      queryClient.invalidateQueries({ queryKey: ['accrual-requests'] });
      toast.success('Yêu cầu đã được phê duyệt thành công');
    },
    onError: (error) => {
      console.error('Failed to approve request:', error);
      toast.error('Không thể phê duyệt yêu cầu. Vui lòng thử lại.');
    },
  });
};

export const useRejectAccrualRequest = () => {
  const queryClient = useQueryClient();
  const { rejectAccrualRequest } = useAccrualRequestsService();

  return useMutation({
    mutationFn: ({ id, rejectReason }: { id: Big; rejectReason: string }) =>
      rejectAccrualRequest(id, rejectReason),
    onSuccess: () => {
      // Invalidate and refetch accrual requests
      queryClient.invalidateQueries({ queryKey: ['accrual-requests'] });
      toast.success('Yêu cầu đã được từ chối thành công');
    },
    onError: (error) => {
      console.error('Failed to reject request:', error);
      toast.error('Không thể từ chối yêu cầu. Vui lòng thử lại.');
    },
  });
};
