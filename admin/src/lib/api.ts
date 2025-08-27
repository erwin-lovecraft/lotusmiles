import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { config as envConfig } from '@/config/env';
import { useAuth0 } from '@auth0/auth0-react';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: envConfig.api.baseUrl,
  timeout: 100_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Only add token if the request URL matches our base URL
    if (config.url && config.url.startsWith(envConfig.api.baseUrl)) {
      try {
        // Get token from Auth0 (this will be called in a React component context)
        // We'll handle the token injection in the hook
        return config;
      } catch (error) {
        console.error('Failed to get access token:', error);
        return config;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

export { apiClient };

// Hook to get authenticated API client
export const useApiClient = () => {
  const { getAccessTokenSilently } = useAuth0();

  const authenticatedApiClient = axios.create({
    baseURL: envConfig.api.baseUrl,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add request interceptor with token
  authenticatedApiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      if (config.baseURL && config.baseURL === envConfig.api.baseUrl) {
        try {
          const token = await getAccessTokenSilently();
          if (config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Failed to get access token:', error);
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor
  authenticatedApiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.error('Unauthorized access');
      }
      return Promise.reject(error);
    }
  );

  return authenticatedApiClient;
};
