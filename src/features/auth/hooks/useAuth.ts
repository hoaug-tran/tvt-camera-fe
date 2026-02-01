import useAuthStore from "@features/auth/stores/auth.store";

const useAuth = () => {
  const { user, isAuthenticated, logout } = useAuthStore();

  function hasRole(role: string) {
    return user?.role === role;
  }

  return {
    user,
    isAuthenticated,
    logout,
    hasRole,
  };
};

export default useAuth;
