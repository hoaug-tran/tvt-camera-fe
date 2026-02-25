import { create } from "zustand";
import type { User } from "@features/auth/types/auth.types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
  updateAccessToken: (accessToken: string) => void;
}

/**
 * Auth Store - Zustand
 *
 * Storage strategy:
 * - AccessToken: Stored in-memory (cleared on page refresh)
 * - RefreshToken: HTTP-only Cookie (persisted, auto-sent by browser)
 * - User info: Stored in-memory
 *
 * Lợi ích:
 * ✅ Access token không thể bị XSS (JS không thể truy cập cookie)
 * ✅ Refresh token HTTP-only, không thể lấy từ JS
 * ✅ Refresh tự động: Browser tự gửi cookie, backend tạo token mới
 * ✅ Đơn giản hơn localStorage (không cần sync giữa tabs)
 *
 * Flow:
 * 1. Login: Get access token + backend set refresh token cookie
 * 2. Request: Gửi access token ở header, refresh token ở cookie
 * 3. Token hết hạn: Interceptor call refresh, backend lấy cookie
 * 4. Logout: Backend xóa cookie, store xóa in-memory data
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  /**
   * Login sau khi đăng nhập thành công
   * - AccessToken: In-memory (sẽ được gửi ở Authorization header)
   * - RefreshToken: Đã được set vào cookie bởi backend
   */
  login: (user: User, accessToken: string) => {
    set({
      user,
      accessToken,
      isAuthenticated: true,
    });
  },

  /**
   * Logout - Xóa tất cả auth data từ memory
   * RefreshToken cookie sẽ được backend xóa khi call logout endpoint
   */
  logout: () => {
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });
  },

  /**
   * Update access token (sau khi refresh token)
   * Dùng khi access token hết hạn, gọi refresh endpoint
   * Receive token mới từ backend
   */
  updateAccessToken: (accessToken: string) => {
    set({ accessToken });
  },
}));

export default useAuthStore;
