import { type MileageAccrualRequestForm } from '@/types/mileage-accrual-request';
import { type AxiosInstance } from 'axios';
import { ApiError } from '@/lib/types/api-error';

export interface CreateMileageAccrualRequestResponse {
  id: string;
  status: string;
  message: string;
}

export const createMileageAccrualRequest = async (
  apiClient: AxiosInstance,
  data: MileageAccrualRequestForm
): Promise<CreateMileageAccrualRequestResponse> => {
  try {
    const response = await apiClient.post<CreateMileageAccrualRequestResponse>(
      '/api/v1/accrual-requests/',
      data,
    );
    return response.data;
  } catch (error: unknown) {
    throw ApiError.fromAxiosError(error);
  }
};
