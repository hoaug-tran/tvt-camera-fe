import { darkPalette } from "@/themes/palette";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Avatar,
  Stack,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Video,
  History,
  Zap,
  Settings,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";
import { useAuthStore } from "@features/auth/stores/auth.store";
import { useLogout } from "@features/auth/hooks/useLogout";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const { logout, loading: logoutLoading } = useLogout();
  const [currentTime, setCurrentTime] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate("/login");
  };

  const menuItems = [
    { id: "live", label: "Xem trực tiếp", icon: Video, path: "/home" },
    { id: "replay", label: "Xem lại", icon: History, path: null },
    { id: "ai", label: "AI Trợ lý", icon: Zap, path: null },
    {
      id: "settings",
      label: "Cấu hình",
      icon: Settings,
      path: "/cameras/management",
    },
  ];

  const activeTab =
    menuItems.find(
      (item) => item.path && location.pathname.startsWith(item.path),
    )?.id ?? "";

  const handleTabClick = (item: { id: string; path: string | null }) => {
    if (item.path) {
      navigate(item.path);
    }
  };

  const userInitials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: darkPalette.neutral[900] }}>
        <Toolbar
          disableGutters
          sx={{
            px: 2,
            minHeight: 64,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left: Logo */}
          <Typography
            variant="h6"
            component="a"
            noWrap
            sx={{
              fontFamily: "Inter",
              fontWeight: 700,
              letterSpacing: ".2rem",
              color: "inherit",
              textDecoration: "none",
              fontSize: "1.1rem",
              minWidth: "fit-content",
            }}
          >
            QUẢN LÝ CAMERA TVT
          </Typography>

          {/* Middle: Menu Tabs */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 0.5,
              flex: 1,
              justifyContent: "center",
              ml: 4,
            }}
          >
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <Button
                  key={item.id}
                  onClick={() => handleTabClick(item)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 1,
                    borderRadius: "6px",
                    color: isActive
                      ? darkPalette.secondary.main
                      : darkPalette.neutral[400],
                    backgroundColor: isActive
                      ? "rgba(232, 92, 74, 0.1)"
                      : "transparent",
                    borderBottom: isActive
                      ? `2px solid ${darkPalette.secondary.main}`
                      : "none",
                    transition: "all 0.2s ease",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    textTransform: "none",
                    "&:hover": {
                      color: darkPalette.secondary.main,
                      backgroundColor: "rgba(232, 92, 74, 0.05)",
                    },
                  }}
                >
                  <Icon size={18} />
                  {item.label}
                </Button>
              );
            })}
          </Box>

          {/* Right: Time + Avatar + User */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ ml: "auto" }}
          >
            {/* Current Time */}
            <Typography
              sx={{
                fontSize: "0.85rem",
                color: darkPalette.neutral[100],
                display: { xs: "none", sm: "block" },
                minWidth: "180px",
                textAlign: "right",
                fontFamily: "monospace",
              }}
            >
              {currentTime}
            </Typography>

            {/* Avatar + Username - Dropdown */}
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              onClick={handleMenuOpen}
              sx={{
                cursor: "pointer",
                px: 1.5,
                py: 0.75,
                borderRadius: "8px",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "rgba(255, 165, 0, 0.1)",
                },
                userSelect: "none",
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: darkPalette.secondary.main,
                  fontSize: "0.9rem",
                  fontWeight: 600,
                }}
              >
                {userInitials}
              </Avatar>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "inherit",
                  }}
                >
                  {user?.displayName || "Người dùng"}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: darkPalette.neutral[400],
                    textTransform: "capitalize",
                  }}
                >
                  {user?.role || "user"}
                </Typography>
              </Box>
              <ChevronDown
                size={18}
                color={darkPalette.neutral[400]}
                style={{
                  transform: openMenu ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              />
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Avatar Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            bgcolor: darkPalette.background.surface,
            border: `1px solid ${darkPalette.divider}`,
            borderRadius: "8px",
            marginTop: "8px",
            boxShadow: "0 12px 32px rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <MenuItem
          disabled
          sx={{
            color: darkPalette.neutral[50],
            fontWeight: 600,
            py: 1.5,
            px: 2,
          }}
        >
          {user?.displayName || "Người dùng"}
        </MenuItem>
        <Divider sx={{ my: 0.5, bgcolor: darkPalette.divider }} />
        <MenuItem
          onClick={handleMenuClose}
          sx={{
            color: darkPalette.neutral[400],
            fontSize: "0.9rem",
            py: 1,
            px: 2,
            "&:hover": {
              bgcolor: `rgba(232, 92, 74, 0.1)`,
              color: darkPalette.secondary.main,
            },
          }}
        >
          <User size={16} style={{ marginRight: 12 }} />
          Xem thông tin
        </MenuItem>
        <MenuItem
          onClick={handleMenuClose}
          sx={{
            color: darkPalette.neutral[400],
            fontSize: "0.9rem",
            py: 1,
            px: 2,
            "&:hover": {
              bgcolor: `rgba(232, 92, 74, 0.1)`,
              color: darkPalette.secondary.main,
            },
          }}
        >
          <Settings size={16} style={{ marginRight: 12 }} />
          Cài đặt
        </MenuItem>
        <Divider sx={{ my: 0.5, bgcolor: darkPalette.divider }} />
        <MenuItem
          onClick={handleLogout}
          sx={{
            color: darkPalette.semantic.error,
            fontSize: "0.9rem",
            py: 1,
            px: 2,
            "&:hover": { bgcolor: `rgba(239, 68, 68, 0.1)`, color: "#ef4444" },
          }}
        >
          <LogOut size={16} style={{ marginRight: 12 }} />
          {logoutLoading ? "Đang đăng xuất..." : "Đăng xuất"}
        </MenuItem>
      </Menu>
    </>
  );
};

