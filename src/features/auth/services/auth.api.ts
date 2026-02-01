import type {
  LoginRequest,
  LoginResponse,
} from "@features/auth/types/auth.types";

const API_URL = import.meta.env.VITE_API_URL;

const getErrorMessage = (status: number, serverMessage?: string): string => {
  if (serverMessage) return serverMessage;

  switch (status) {
    case 400:
      return "Dữ liệu không hợp lệ";
    case 401:
      return "Tên đăng nhập hoặc mật khẩu không chính xác";
    case 500:
      return "Lỗi máy chủ, vui lòng thử lại sau";
    default:
      return "Đăng nhập thất bại";
  }
};

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
      const error = await response.json().catch(() => ({}));
      throw new Error(getErrorMessage(response.status, error.message));
    }

    return response.json();
  },
};
