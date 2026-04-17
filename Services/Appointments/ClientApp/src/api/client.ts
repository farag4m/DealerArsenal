import axios from 'axios';
import { env } from '../env';

export const apiClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
});

// Attach correlation ID to every request for distributed tracing
apiClient.interceptors.request.use((config) => {
  config.headers['X-Correlation-ID'] = crypto.randomUUID();
  return config;
});

// Surface structured error messages from the backend
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string } | undefined)?.message ??
        error.message ??
        'An unexpected error occurred';
      return Promise.reject(new Error(message));
    }
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  },
);
