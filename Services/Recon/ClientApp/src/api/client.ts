import axios from 'axios';

const baseURL = import.meta.env['VITE_RECON_API_BASE_URL'];

if (!baseURL && import.meta.env.PROD) {
  throw new Error('VITE_RECON_API_BASE_URL must be set in production');
}

export const apiClient = axios.create({
  baseURL: baseURL ?? 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    // Log error for observability without leaking internals
    console.error('[Recon API Error]', error);
    return Promise.reject(error);
  },
);
