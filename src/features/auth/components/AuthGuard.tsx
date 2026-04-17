import { useAuth } from "@features/auth/hooks/useAuth";
import { useAuthStore } from "@features/auth/stores/auth.store";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const { isInitializing } = useAuthStore();

  if (isInitializing) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
