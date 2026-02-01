import type {
  LoginRequest,
  LoginResponse,
} from "@features/auth/types/auth.types";

const API_URL = import.meta.env.VITE_API_URL;

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Đăng nhập thất bại");
    }

    return response.json();
  },
};
