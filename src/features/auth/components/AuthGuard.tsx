import { Navigate } from "react-router-dom";
import useAuth from "@features/auth/hooks/useAuth";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
