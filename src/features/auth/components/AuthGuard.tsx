import { useAuth } from "@features/auth/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { authApi } from "@features/auth/services/auth.api";
import { useAuthStore } from "@features/auth/stores/auth.store";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, accessToken } = useAuth();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      setLoading(false);
      return;
    }

    const tryRefresh = async () => {
      try {
        const result = await authApi.refresh();
        login({ username: "user", role: "user" }, result.accessToken);
      } catch {
        // refresh token invalid or expired — user must log in again
      } finally {
        setLoading(false);
      }
    };

    tryRefresh();
  }, [isAuthenticated, accessToken, login]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
