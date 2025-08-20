import { useMutation } from '@tanstack/react-query';
import { useApiClient } from '@/lib/api';
import { createMileageAccrualRequest, type CreateMileageAccrualRequestResponse } from '@/lib/services/mileage-accrual-request';
import { type MileageAccrualRequestForm } from '@/types/mileage-accrual-request';

export const useCreateMileageAccrualRequest = () => {
  const apiClient = useApiClient();

  return useMutation<
    CreateMileageAccrualRequestResponse,
    Error,
    MileageAccrualRequestForm
  >({
    mutationFn: (data: MileageAccrualRequestForm) =>
      createMileageAccrualRequest(apiClient, data),
    onSuccess: (data) => {
      console.log('Mileage accrual request created successfully:', data);
    },
    onError: (error) => {
      console.error('Failed to create mileage accrual request:', error);
    },
  });
};
