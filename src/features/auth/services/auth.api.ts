import { httpClient } from "@services/http/http-client";
import type {
  LoginRequest,
  LoginResponse,
  RefreshResponse,
} from "@features/auth/types/auth.types";
import { logError } from "@utils/errorHandler";

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await httpClient.post("/auth/login", credentials);
      return response.data.data as LoginResponse;
    } catch (error) {
      logError("authApi.login", error, { username: credentials.username });
      throw error;
    }
  },

  refresh: async (): Promise<RefreshResponse> => {
    try {
      const response = await httpClient.post("/auth/refresh");
      return response.data.data as RefreshResponse;
    } catch (error) {
      logError("authApi.refresh", error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await httpClient.post("/auth/logout");
    } catch (error) {
      logError("authApi.logout", error);
      throw error;
    }
  },
};
