import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Avatar,
  ListItemIcon,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  VideoCameraFront as CameraIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useAuthStore } from "@features/auth/stores/auth.store";
import { useNavigate } from "react-router-dom";
import { darkPalette, darkTextColor } from "@/themes/palette";

interface NavbarProps {
  onMenuClick?: () => void;
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
  };

  const userName = user?.displayName || user?.username || "Người dùng";

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: darkPalette.background.surface,
        borderBottom: `1px solid ${darkPalette.divider}`,
        color: darkTextColor.primary,
      }}
    >
      <Toolbar
        sx={{ justifyContent: "space-between", minHeight: { xs: 56, sm: 64 } }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 1, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <CameraIcon
            sx={{
              mr: 1.5,
              display: { xs: "none", md: "flex" },
              color: darkPalette.secondary.main,
            }}
          />

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontWeight: 800,
              letterSpacing: 1,
              cursor: "pointer",
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
              background: `linear-gradient(45deg, ${darkTextColor.primary} 30%, ${darkPalette.secondary.light} 90%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            onClick={() => navigate("/home")}
          >
            TVT CAMERA
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, sm: 1.5 },
          }}
        >
          {!isMobile && (
            <Button
              variant="text"
              color="inherit"
              startIcon={<SettingsIcon />}
              onClick={() => navigate("/cameras/management")}
              sx={{
                borderRadius: 2,
                px: 2,
                fontWeight: 600,
                color: darkTextColor.secondary,
                "&:hover": {
                  color: darkTextColor.primary,
                  bgcolor: "rgba(255,255,255,0.05)",
                },
              }}
            >
              Cấu hình
            </Button>
          )}

          <Box
            sx={{
              width: "1px",
              height: "24px",
              bgcolor: darkPalette.divider,
              mx: 1,
              display: { xs: "none", md: "block" },
            }}
          />

          {/* User Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {/* Hiển thị tên user trên Desktop */}
            {!isTablet && (
              <Box
                sx={{
                  textAlign: "right",
                  display: { xs: "none", md: "block" },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, lineHeight: 1.2 }}
                >
                  {userName}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: darkTextColor.secondary, fontSize: "0.7rem" }}
                >
                  Quản trị viên
                </Typography>
              </Box>
            )}

            <Tooltip title="Tài khoản">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0.5 }}>
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: darkPalette.secondary.main,
                    border: `2px solid ${darkPalette.divider}`,
                  }}
                >
                  {userName.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>

          <Menu
            sx={{ mt: "45px" }}
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={Boolean(anchorEl)}
            onClose={handleCloseUserMenu}
            PaperProps={{
              sx: {
                bgcolor: darkPalette.background.elevated,
                border: `1px solid ${darkPalette.divider}`,
                color: darkTextColor.primary,
                minWidth: 200,
                mt: 1,
              },
            }}
          >
            {/* User Info Header in Menu for Tablet/Mobile */}
            {isTablet && (
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700 }}>
                  {userName}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: darkTextColor.secondary }}
                  noWrap
                >
                  Quản trị viên hệ thống
                </Typography>
                <Box
                  sx={{ height: "1px", bgcolor: darkPalette.divider, mt: 1.5 }}
                />
              </Box>
            )}

            {/* Chỉ show Cấu hình trong menu trên Mobile/Tablet */}
            {isMobile && (
              <MenuItem
                onClick={() => {
                  navigate("/cameras/management");
                  handleCloseUserMenu();
                }}
                sx={{ py: 1.2 }}
              >
                <ListItemIcon>
                  <SettingsIcon
                    fontSize="small"
                    sx={{ color: darkTextColor.secondary }}
                  />
                </ListItemIcon>
                <Typography variant="body2">Cấu hình hệ thống</Typography>
              </MenuItem>
            )}

            <MenuItem
              onClick={handleLogout}
              sx={{ py: 1.2, color: darkPalette.semantic.error }}
            >
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: "inherit" }} />
              </ListItemIcon>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Đăng xuất
              </Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
