import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import type { ApiError } from "@/types/auth";

// Global reference to getAccessTokenSilently - will be set by Auth0Provider
let getAccessTokenSilently: (() => Promise<string>) | null = null;

export function setTokenGetter(tokenGetter: () => Promise<string>) {
  getAccessTokenSilently = tokenGetter;
}

const httpClient = axios.create({
  timeout: 10000,
});

// Request interceptor to attach Authorization header
httpClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const url = config.url || "";

    // Only attach token for API calls to our backend
    if (url.startsWith(import.meta.env.VITE_API_BASE_URL) && getAccessTokenSilently) {
      try {
        const token = await getAccessTokenSilently();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Failed to get access token:", error);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for 401 handling and error mapping
let isRetrying = false;

httpClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 with token refresh (only once)
    if (error.response?.status === 401 && !isRetrying && !originalRequest._retry) {
      isRetrying = true;
      originalRequest._retry = true;

      try {
        if (getAccessTokenSilently) {
          const newToken = await getAccessTokenSilently();
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return httpClient(originalRequest);
        }
      } catch (refreshError) {
        // If token refresh fails, redirect to login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRetrying = false;
      }
    }

    // Map server errors to ApiError format
    const apiError: ApiError = {
      code: error.response?.data?.code || "UNKNOWN_ERROR",
      message: error.response?.data?.message || "An unexpected error occurred",
      fields: error.response?.data?.fields,
    };

    return Promise.reject(apiError);
  }
);

export { httpClient };
