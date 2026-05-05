import { useState } from "react";
import { Box, Drawer } from "@mui/material";
import { CameraSidebar } from "./CameraSidebar";
import { VideoGrid } from "@layouts/main/VideoGrid";
import { CameraFooter } from "@layouts/footer/CameraFooter";
import { Navbar } from "@layouts/header/Navbar";
import { darkPalette } from "@/themes/palette";

const DRAWER_WIDTH = 280;

export const CameraPanel = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column", 
      height: { xs: "100dvh", sm: "100vh" }, // Sử dụng dvh để thích ứng thanh địa chỉ mobile
      overflow: "hidden",
      bgcolor: darkPalette.background.default 
    }}>
      <Navbar onMenuClick={handleDrawerToggle} />
      
      <Box sx={{ 
        display: "flex", 
        flex: 1, 
        overflow: "hidden", 
        mt: { xs: "56px", sm: "64px" } //Navbar height
      }}>
        {/* Sidebar Navigation (Desktop) */}
        <Box
          component="nav"
          sx={{ 
            width: { xs: 0, sm: DRAWER_WIDTH }, 
            flexShrink: 0,
            height: "100%",
            flexDirection: "column",
            borderRight: `1px solid ${darkPalette.divider}`,
            display: { xs: "none", sm: "flex" } 
          }}
        >
          <Box sx={{ height: "100%", width: "100%", overflow: "hidden" }}>
             <CameraSidebar />
          </Box>
        </Box>

        {/* Mobile Drawer (Temporary) */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { 
              boxSizing: "border-box", 
              width: DRAWER_WIDTH,
              bgcolor: darkPalette.background.surface,
              backgroundImage: "none"
            },
          }}
        >
          <CameraSidebar onCameraSelect={() => setMobileOpen(false)} />
        </Drawer>

        {/* Main Viewing Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden", 
            height: "100%",
            minHeight: 0, // Quan trọng để flex child không vượt quá parent
            width: { xs: '100%', sm: `calc(100% - ${DRAWER_WIDTH}px)` }
          }}
        >
          {/* Grid Area - Phụ trách scroll nội bộ */}
          <Box sx={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
             <VideoGrid />
          </Box>

          {/* Footer Area - Luôn cố định phía dưới */}
          <Box sx={{ flexShrink: 0, width: "100%" }}>
             <CameraFooter />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CameraPanel;
