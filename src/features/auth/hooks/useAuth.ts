import { useAuthStore } from "@features/auth/stores/auth.store";

/**
 * Hook để access auth state và methods
 * Thay thế cách dùng: token -> accessToken
 */
export const useAuth = () => {
  const { user, accessToken, isAuthenticated, logout } = useAuthStore();

  return {
    user,
    accessToken,
    isAuthenticated,
    logout,
  };
};
