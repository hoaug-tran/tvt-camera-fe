import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { AuthGuard } from "@features/auth/components/AuthGuard";
import { HomePage } from "./pages/HomePage";
import { CameraManagementPage } from "@features/cameras/pages/CameraManagementPage";
import { CameraViewerPage } from "@features/cameras/pages/CameraViewerPage";
import { useInitializeAuth } from "@features/auth/hooks/useInitializeAuth";

function App() {
  useInitializeAuth();

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/home"
          element={
            <AuthGuard>
              <HomePage />
            </AuthGuard>
          }
        />
        <Route
          path="/cameras/management"
          element={
            <AuthGuard>
              <CameraManagementPage />
            </AuthGuard>
          }
        />
        <Route
          path="/cameras/viewer"
          element={
            <AuthGuard>
              <CameraViewerPage />
            </AuthGuard>
          }
        />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </>
  );
}

export default App;
