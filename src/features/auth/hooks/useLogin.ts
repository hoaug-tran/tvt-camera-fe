import { useState } from "react";
import axios from "axios";
import { useAuthStore } from "@features/auth/stores/auth.store";
import { authApi } from "@features/auth/services/auth.api";
import type { LoginRequest } from "@features/auth/types/auth.types";

interface LoginResult {
  ok: boolean;
  error?: string;
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();

  const submit = async (
    username: string,
    password: string,
  ): Promise<LoginResult> => {
    setIsLoading(true);

    try {
      const request: LoginRequest = { username, password };
      const res = await authApi.login(request);

      login(
        {
          userId: res.userId,
          username,
          displayName: res.displayName || username,
          // TODO: Cần xoá trong tương lai
          role: res.role.toLowerCase() as "admin" | "user",
        },
        res.accessToken,
      );

      return { ok: true };
    } catch (error: unknown) {
      let message = "Tên đăng nhập hoặc mật khẩu không chính xác";

      if (axios.isAxiosError(error) && error.response?.data) {
        const data = error.response.data as { message?: string };
        message = data.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      return {
        ok: false,
        error: message,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { submit, loading: isLoading };
};
