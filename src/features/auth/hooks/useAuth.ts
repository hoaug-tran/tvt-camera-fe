import { useAuthStore } from "@features/auth/stores/auth.store";

export const useAuth = () => {
  const { user, accessToken, isAuthenticated, logout } = useAuthStore();

  return {
    user,
    accessToken,
    isAuthenticated,
    logout,
  };
};
