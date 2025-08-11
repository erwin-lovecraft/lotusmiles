// httpClient.ts
import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import type { ApiError } from "@/types/auth";

// Augment AxiosRequestConfig to tag retried requests
declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

// === Auth token plumbing ===
let getAccessTokenSilently: (() => Promise<string>) | null = null;
export function setTokenGetter(tokenGetter: () => Promise<string>) {
  getAccessTokenSilently = tokenGetter;
}

// Single-flight refresh so concurrent 401s queue behind one call
let refreshPromise: Promise<string> | null = null;
async function refreshAccessToken(): Promise<string> {
  if (!getAccessTokenSilently) throw new Error("No token getter configured");
  if (!refreshPromise) {
    refreshPromise = getAccessTokenSilently().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
});

// === Request: attach token ===
httpClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (getAccessTokenSilently) {
      try {
        const token = await getAccessTokenSilently();
        config.headers.Authorization = `Bearer ${token}`;
      } catch {
        // ignore; request will likely 401 and then we refresh
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// === Error normalization ===
function normalizeError(err: unknown): ApiError {
  // Network / unknown
  if (!axios.isAxiosError(err)) {
    return { code: "UNKNOWN_ERROR", message: "Unexpected error" };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const axErr = err as AxiosError<any>;
  const status = axErr.response?.status;

  // Timeout or network down (no response)
  if (axErr.code === "ECONNABORTED") {
    return { code: "TIMEOUT", message: "Request timed out" };
  }
  if (!axErr.response) {
    return { code: "NETWORK_ERROR", message: "Network error. Check connection." };
  }

  // Server returned a body – your API spec says { error, error_description }
  const data = axErr.response.data ?? {};
  const codeFromApi = data.error as string | undefined;
  const descFromApi = data.error_description as string | undefined;

  // 400 with field errors (your special case)
  if (status === 400 && typeof data === "object") {
    // If BE sends invalid fields as map, keep it
    const invalid = (data.invalid_fields ??
      data.errors ??
      undefined) as Record<string, string> | undefined;

    if (invalid) {
      return {
        code: codeFromApi ?? "invalid_data",
        message: descFromApi ?? "Invalid data",
        invalid_fields: invalid,
      };
    }
    // fallback
    return {
      code: codeFromApi ?? "invalid_data",
      message: descFromApi ?? "Invalid data",
    };
  }

  if (status === 401) {
    return { code: "UNAUTHORIZED", message: "Unauthorized" };
  }
  if (status === 403) {
    return { code: "FORBIDDEN", message: "Forbidden" };
  }
  if (status === 404) {
    return { code: "NOT_FOUND", message: "Not found" };
  }
  if (status === 409) {
    return { code: "CONFLICT", message: descFromApi ?? "Conflict" };
  }
  if (status === 422) {
    return {
      code: "UNPROCESSABLE_ENTITY",
      message: descFromApi ?? "Unprocessable entity",
      invalid_fields: (data.invalid_fields ??
        data.errors ??
        undefined) as Record<string, string> | undefined,
    };
  }
  if (status === 429) {
    const ra = axErr.response.headers?.["retry-after"];
    const hint = ra ? `; retry after ${ra}s` : "";
    return { code: "RATE_LIMITED", message: `Too many requests${hint}` };
  }
  if (status && status >= 500) {
    return { code: "SERVER_ERROR", message: descFromApi ?? "Server error" };
  }

  // Fallback to API’s own fields if present
  return {
    code: codeFromApi ?? "UNKNOWN_ERROR",
    message: descFromApi ?? "An unexpected error occurred",
  };
}

// === Response: 401 refresh + final rejection as ApiError ===
httpClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    // Only handle Axios errors
    if (!axios.isAxiosError(error)) {
      return Promise.reject({ code: "UNKNOWN_ERROR", message: "Unexpected error" } satisfies ApiError);
    }

    const original = error.config as InternalAxiosRequestConfig | undefined;

    // If 401 and we haven't retried, refresh once and replay
    if (error.response?.status === 401 && original && !original._retry) {
      try {
        original._retry = true;
        const newToken = await refreshAccessToken();
        original.headers = original.headers ?? {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (original.headers as any).Authorization = `Bearer ${newToken}`;
        return httpClient(original);
      } catch {
        // Let the app decide (e.g., redirect) based on UNAUTHORIZED error
        return Promise.reject({ code: "UNAUTHORIZED", message: "Unauthorized" } satisfies ApiError);
      }
    }

    // Always reject with normalized ApiError
    return Promise.reject(normalizeError(error));
  }
);
