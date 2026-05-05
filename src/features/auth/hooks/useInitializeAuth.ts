import { useEffect, useRef } from "react";
import { useAuthStore } from "@features/auth/stores/auth.store";
import { authApi } from "@features/auth/services/auth.api";

export const useInitializeAuth = () => {
  const { accessToken, user, login, logout, setIsInitializing } =
    useAuthStore();

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (accessToken && user) {
      setIsInitializing(false);
      return;
    }

    const restoreSession = async () => {
      try {
        const res = await authApi.refresh();

        if (!res?.accessToken || !res?.user) {
          setIsInitializing(false);
          return;
        }

        login(
          {
            userId: res.user.userId,
            username: res.user.username,
            displayName: res.user.displayName || res.user.username,
          },
          res.accessToken,
        );
      } catch {
        logout();
      }
    };

    restoreSession();
  }, [accessToken, user, login, logout, setIsInitializing]);
};
