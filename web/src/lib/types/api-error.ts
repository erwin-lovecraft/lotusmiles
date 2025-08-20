export interface ApiErrorResponse {
  error: string;
  error_description: string;
}

export class ApiError extends Error {
  public readonly error: string;
  public readonly error_description: string;
  public readonly status?: number;

  constructor(error: string, error_description: string, status?: number) {
    super(error_description);
    this.name = 'ApiError';
    this.error = error;
    this.error_description = error_description;
    this.status = status;
  }

  static fromResponse(response: ApiErrorResponse, status?: number): ApiError {
    return new ApiError(response.error, response.error_description, status);
  }

  static fromAxiosError(error: unknown): ApiError {
    // Type guard to check if error has response property
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: unknown; status?: number } };
      if (axiosError.response?.data && 
          typeof axiosError.response.data === 'object' && 
          axiosError.response.data !== null &&
          'error' in axiosError.response.data && 
          'error_description' in axiosError.response.data) {
        const errorData = axiosError.response.data as { error: string; error_description: string };
        return ApiError.fromResponse(errorData, axiosError.response.status);
      }
    }
    
    // Fallback for network errors or other types of errors
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    const status = error && typeof error === 'object' && 'response' in error 
      ? (error as { response?: { status?: number } }).response?.status 
      : undefined;
    
    return new ApiError(
      'network_error',
      errorMessage,
      status
    );
  }
}
