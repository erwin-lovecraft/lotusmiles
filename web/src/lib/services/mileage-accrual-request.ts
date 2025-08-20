import { type MileageAccrualRequestForm } from '@/types/mileage-accrual-request';
import { type AxiosInstance } from 'axios';

export interface CreateMileageAccrualRequestResponse {
  id: string;
  status: string;
  message: string;
}

export const createMileageAccrualRequest = async (
  apiClient: AxiosInstance,
  data: MileageAccrualRequestForm
): Promise<CreateMileageAccrualRequestResponse> => {
  const response = await apiClient.post<CreateMileageAccrualRequestResponse>(
    '/api/v1/accrual-requests/',
    data,
  );
  return response.data;
};
