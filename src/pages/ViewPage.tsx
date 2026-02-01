import { Box, Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import useAuthStore from "@features/auth/stores/auth.store";

const ViewPage = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5", py: 4 }}>
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            TVT Camera System
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" sx={{ color: "#666" }}>
              {user?.username}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<LogOut size={18} />}
              onClick={handleLogout}
              sx={{
                textTransform: "none",
                color: "#666",
                borderColor: "#ddd",
                "&:hover": {
                  borderColor: "#bbb",
                  backgroundColor: "#fafafa",
                },
              }}
            >
              Đăng xuất
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            p: 4,
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="h6" sx={{ color: "#333", fontWeight: 500 }}>
            Đây là trang xem camera
          </Typography>
          <Typography variant="body2" sx={{ color: "#999", mt: 1 }}>
            Trang này sẽ được phát triển để hiển thị video từ các camera
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default ViewPage;
