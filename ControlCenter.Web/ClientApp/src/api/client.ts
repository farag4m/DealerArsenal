import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  // Propagate correlation ID if already set in session storage (e.g. from prior request)
  const correlationId =
    sessionStorage.getItem("x-correlation-id") ?? crypto.randomUUID();
  config.headers["X-Correlation-Id"] = correlationId;
  return config;
});

apiClient.interceptors.response.use((response) => {
  const correlationId = response.headers["x-correlation-id"] as
    | string
    | undefined;
  if (correlationId !== undefined && correlationId.length > 0) {
    sessionStorage.setItem("x-correlation-id", correlationId);
  }
  return response;
});

export { apiClient };
