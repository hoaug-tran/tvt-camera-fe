import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@features/auth/stores/auth.store";
import { authApi } from "@features/auth/services/auth.api";

export const createHttpClient = (): AxiosInstance => {
  const apiUrl = import.meta.env.VITE_API_URL as string;

  const client = axios.create({
    baseURL: apiUrl,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  let isRefreshing = false;
  let failedQueue: Array<(token: string) => void> = [];

  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      const isRefreshEndpoint =
        typeof originalRequest.url === "string" &&
        originalRequest.url.includes("/auth/refresh");

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !isRefreshEndpoint
      ) {
        if (isRefreshing) {
          return new Promise((resolve) => {
            failedQueue.push((token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(client.request(originalRequest));
            });
          });
        }

        isRefreshing = true;
        originalRequest._retry = true;

        try {
          const refreshResult = await authApi.refresh();
          const newAccessToken = refreshResult.accessToken;

          useAuthStore.getState().updateAccessToken(newAccessToken);

          failedQueue.forEach((fn) => fn(newAccessToken));
          failedQueue = [];

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          return client.request(originalRequest);
        } catch (_refreshError) {
          failedQueue = [];
          useAuthStore.getState().logout();
          window.location.href = "/login";
          return Promise.reject(_refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    },
  );

  return client;
};

export const httpClient = createHttpClient();
