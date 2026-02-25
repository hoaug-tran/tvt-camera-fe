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
import { Lock } from "lucide-react";
import { useLogin } from "@features/auth/hooks/useLogin";
import { darkPalette } from "@themes/palette";

export const LoginPage = () => {
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
      navigate("/");
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
        backgroundImage: `linear-gradient(135deg, ${darkPalette.neutral[950]} 0%, ${darkPalette.neutral[900]} 100%)`,
        px: isMobile ? 2 : 0,
        py: 4,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: isMobile ? "100%" : "420px",
          p: isMobile ? 3 : 5,
          borderRadius: "12px",
          bgcolor: darkPalette.background.surface,
          border: `1px solid ${darkPalette.divider}`,
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
        }}
      >
        <Stack spacing={isMobile ? 2.5 : 3}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: isMobile ? 1 : 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 2,
                p: 1.5,
                borderRadius: "8px",
              }}
            >
              <Lock size={32} color={darkPalette.secondary.main} />
            </Box>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              sx={{
                fontWeight: 700,
                color: darkPalette.neutral[50],
                letterSpacing: "0.5px",
              }}
            >
              QUẢN LÍ CAMERA TVT
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: darkPalette.neutral[400],
                mt: 1,
              }}
            >
              Đăng nhập hệ thống quản lý
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{
                borderRadius: "8px",
                bgcolor: `rgba(239, 68, 68, 0.1)`,
                border: `1px solid ${darkPalette.semantic.error}`,
                color: darkPalette.semantic.error,
                "& .MuiAlert-icon": {
                  color: darkPalette.semantic.error,
                },
              }}
            >
              {error}
            </Alert>
          )}

          {/* Form */}
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
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: darkPalette.neutral[900],
                    borderRadius: "8px",
                    fontSize: isMobile ? "0.9rem" : "1rem",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: darkPalette.neutral[800],
                    },
                    "&.Mui-focused": {
                      bgcolor: darkPalette.neutral[800],
                      "& fieldset": {
                        borderColor: darkPalette.secondary.main,
                      },
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    color: darkPalette.neutral[50],
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: darkPalette.neutral[500],
                    opacity: 0.7,
                  },
                  "& .MuiInputLabel-root": {
                    color: darkPalette.neutral[400],
                    "&.Mui-focused": {
                      color: darkPalette.secondary.main,
                    },
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
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: darkPalette.neutral[900],
                    borderRadius: "8px",
                    fontSize: isMobile ? "0.9rem" : "1rem",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: darkPalette.neutral[800],
                    },
                    "&.Mui-focused": {
                      bgcolor: darkPalette.neutral[800],
                      "& fieldset": {
                        borderColor: darkPalette.secondary.main,
                      },
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    color: darkPalette.neutral[50],
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: darkPalette.neutral[500],
                    opacity: 0.7,
                  },
                  "& .MuiInputLabel-root": {
                    color: darkPalette.neutral[400],
                    "&.Mui-focused": {
                      color: darkPalette.secondary.main,
                    },
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                disabled={loading || !username || !password}
                sx={{
                  mt: 2,
                  height: isMobile ? 44 : 48,
                  bgcolor: darkPalette.secondary.main,
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: isMobile ? "0.9rem" : "1rem",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: darkPalette.secondary.dark,
                    boxShadow: `0 8px 24px rgba(232, 92, 74, 0.3)`,
                    transform: "translateY(-2px)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  },
                  "&:disabled": {
                    bgcolor: darkPalette.neutral[700],
                    color: darkPalette.neutral[500],
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

          {/* Footer Info */}
          <Typography
            variant="caption"
            sx={{
              textAlign: "center",
              color: darkPalette.neutral[500],
              mt: 1,
            }}
          >
            Hệ thống quản lý camera TVT © 2025
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};
