import { Box, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { Video, History, Zap, Settings } from "lucide-react";
import { darkPalette } from "@/themes/palette";

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

export const NavTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab =
    menuItems.find(
      (item) => item.path && location.pathname.startsWith(item.path),
    )?.id ?? "";

  return (
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
            onClick={() => item.path && navigate(item.path)}
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
  );
};
