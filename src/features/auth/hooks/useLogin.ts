import { useState } from "react";
import useAuthStore from "@features/auth/stores/auth.store";
import { authApi } from "@features/auth/services/auth.api";
import type { LoginRequest } from "@features/auth/types/auth.types";

interface LoginResult {
  ok: boolean;
  error?: string;
}

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();

  const submit = async (
    username: string,
    password: string,
  ): Promise<LoginResult> => {
    setLoading(true);
    try {
      const credentials: LoginRequest = { username, password };
      const response = await authApi.login(credentials);

      login(
        {
          username,
          role: "admin",
        },
        response.accessToken,
      );

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Tên đăng nhập hoặc mật khẩu không chính xác",
      };
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading };
};

export default useLogin;
