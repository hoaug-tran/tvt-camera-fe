import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./features/auth/pages/LoginPage";
import AuthGuard from "./features/auth/components/AuthGuard";
import ViewPage from "./pages/ViewPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/view"
          element={
            <AuthGuard>
              <ViewPage />
            </AuthGuard>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <DashboardPage />
            </AuthGuard>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
