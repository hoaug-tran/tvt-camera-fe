import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Unlock } from "lucide-react";
import useLogin from "@features/auth/hooks/useLogin";
import { palette, textColor } from "@themes/palette";

const LoginPage = () => {
  const { submit, loading } = useLogin();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await submit(username, password);

    if (res.ok) {
      navigate("/view");
    } else {
      setError(res.error || "Đã xảy ra lỗi");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url(/wallpaper.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        px: isMobile ? 2 : 0,
        py: 4,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          zIndex: 0,
        },
      }}
    >
      <Paper
        elevation={isMobile ? 1 : 4}
        sx={{
          width: "450px",
          maxWidth: isMobile ? "100%" : "600px",
          p: isMobile ? 3 : 6,
          borderRadius: isMobile ? 1 : 2,
          border: isMobile ? "none" : `1px solid ${palette.neutral[200]}`,
          bgcolor: palette.background.surface,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Stack spacing={isMobile ? 2.5 : 4}>
          <Box sx={{ textAlign: "center", mb: isMobile ? 1 : 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <Unlock size={isMobile ? 28 : 40} color={palette.neutral[800]} />
            </Box>
            <Typography
              variant={isMobile ? "h6" : "h4"}
              sx={{
                fontWeight: 700,
                color: textColor.primary,
              }}
            >
              TVT CAMERA
            </Typography>
            <Typography
              variant={isMobile ? "caption" : "body1"}
              sx={{
                color: textColor.secondary,
                mt: 0.5,
                display: "block",
              }}
            >
              Trang quản lý hệ thống camera
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                borderRadius: 1,
                fontSize: isMobile ? 12 : 13,
                display: "flex",
                alignItems: "center",
                "& .MuiAlert-icon": {
                  marginRight: 1.5,
                  marginTop: 0,
                },
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Tên đăng nhập"
                size={isMobile ? "small" : "medium"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                autoComplete="username"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: palette.neutral[50],
                  },
                }}
              />

              <TextField
                fullWidth
                type="password"
                label="Mật khẩu"
                size={isMobile ? "small" : "medium"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: palette.neutral[50],
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                disabled={loading || !username || !password}
                sx={{
                  mt: 1,
                  height: isMobile ? 40 : 48,
                  bgcolor: palette.neutral[800],
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: isMobile ? 14 : 15,
                  borderRadius: 1,
                  "&:hover": {
                    bgcolor: palette.neutral[900],
                  },
                  "&:disabled": {
                    bgcolor: palette.neutral[300],
                    color: palette.neutral[500],
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </Stack>
          </Box>

          <Typography
            variant={isMobile ? "caption" : "body2"}
            sx={{
              color: palette.neutral[500],
              textAlign: "center",
            }}
          >
            Demo: admin / admin
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default LoginPage;
