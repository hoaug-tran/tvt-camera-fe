import { useState, useEffect } from "react";
import {
  Stack,
  Typography,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { ChevronDown, LogOut, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@features/auth/stores/auth.store";
import { useLogout } from "@features/auth/hooks/useLogout";
import { darkPalette } from "@/themes/palette";

export const UserActions = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { logout, loading: logoutLoading } = useLogout();
  const [currentTime, setCurrentTime] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleString("vi-VN", {
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

  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate("/login");
  };

  const userInitials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  const menuItemSx = {
    color: darkPalette.neutral[400],
    fontSize: "0.9rem",
    py: 1,
    px: 2,
    "&:hover": {
      bgcolor: `rgba(232, 92, 74, 0.1)`,
      color: darkPalette.secondary.main,
    },
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ ml: "auto" }}
      >
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

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            cursor: "pointer",
            px: 1.5,
            py: 0.75,
            borderRadius: "8px",
            transition: "all 0.2s ease",
            "&:hover": { backgroundColor: "rgba(255, 165, 0, 0.1)" },
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
              sx={{ fontSize: "0.9rem", fontWeight: 600, color: "inherit" }}
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
        <MenuItem onClick={handleMenuClose} sx={menuItemSx}>
          <User size={16} style={{ marginRight: 12 }} />
          Xem thông tin
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={menuItemSx}>
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
