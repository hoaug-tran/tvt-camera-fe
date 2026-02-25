import { useState } from "react";
import { useAuthStore } from "@features/auth/stores/auth.store";
import { authApi } from "@features/auth/services/auth.api";

export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { logout: clearAuthStore } = useAuthStore();

  /**
   * Logout
   * Flow:
   * 1. Call authApi.logout() - Backend xóa refresh token cookie
   * 2. Clear auth store - Xóa access token + user info từ memory
   * 3. Redirect to login page
   */
  const logout = async () => {
    setLoading(true);
    try {
      // Call backend logout endpoint - xóa refresh token cookie
      await authApi.logout();

      // Clear store - In-memory data
      clearAuthStore();

      return { ok: true };
    } catch (error) {
      // Mặc dù backend logout fail, vẫn xóa local auth data
      // Vì frontend không cần biết backend có xóa cookie hay không
      clearAuthStore();
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Logout failed",
      };
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading };
};
