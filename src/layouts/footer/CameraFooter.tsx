import { useState } from "react";
import { Button, Stack, Box } from "@mui/material";
import {
  Camera,
  Video,
  X,
  Maximize2,
  Grid2x2,
  Grid3x3,
  Maximize,
} from "lucide-react";
import { darkPalette } from "@/themes/palette";

export const CameraFooter = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [layout, setLayout] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const layoutOptions = [
    { id: 1, icon: Maximize2, label: "1" },
    { id: 4, icon: Grid2x2, label: "4" },
    { id: 9, icon: Grid3x3, label: "9" },
    { id: 16, icon: Maximize, label: "16" },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: darkPalette.background.surface,
        borderRadius: 0,
        borderTop: `1px solid ${darkPalette.divider}`,
        p: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
      }}
    >
      {/* Left: Layout Options with Icons */}
      <Stack direction="row" spacing={1}>
        {layoutOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Button
              key={option.id}
              onClick={() => setLayout(option.id)}
              variant={layout === option.id ? "contained" : "outlined"}
              size="small"
              startIcon={<Icon size={16} />}
              sx={{
                minWidth: "50px",
                borderColor:
                  layout === option.id
                    ? darkPalette.secondary.main
                    : darkPalette.divider,
                color:
                  layout === option.id ? "#fff" : darkPalette.secondary.main,
                bgcolor:
                  layout === option.id
                    ? darkPalette.secondary.main
                    : "transparent",
                fontSize: "0.8rem",
                fontWeight: 600,
                textTransform: "none",
                display: "flex",
                gap: 0.5,
                "&:hover": {
                  bgcolor:
                    layout === option.id
                      ? darkPalette.secondary.dark
                      : `rgba(232, 92, 74, 0.1)`,
                  borderColor: darkPalette.secondary.main,
                },
                transition: "all 0.2s ease",
              }}
            >
              {option.label}
            </Button>
          );
        })}
      </Stack>

      {/* Right: Action Buttons */}
      <Stack direction="row" spacing={1} alignItems="center">
        {/* Capture */}
        <Button
          startIcon={<Camera size={18} />}
          size="small"
          variant="outlined"
          sx={{
            borderColor: darkPalette.secondary.main,
            color: darkPalette.secondary.main,
            bgcolor: "transparent",
            fontSize: "0.85rem",
            fontWeight: 600,
            textTransform: "none",
            "&:hover": {
              bgcolor: `rgba(232, 92, 74, 0.1)`,
              borderColor: darkPalette.secondary.main,
            },
            transition: "all 0.2s ease",
          }}
        >
          Chụp ảnh
        </Button>

        {/* Record */}
        <Button
          startIcon={<Video size={18} />}
          size="small"
          variant="contained"
          onClick={() => setIsRecording(!isRecording)}
          sx={{
            bgcolor: isRecording ? "#ef4444" : darkPalette.secondary.main,
            color: "#fff",
            fontSize: "0.85rem",
            fontWeight: 600,
            textTransform: "none",
            animation: isRecording ? "pulse 1s infinite" : "none",
            "@keyframes pulse": {
              "0%, 100%": { opacity: 1 },
              "50%": { opacity: 0.7 },
            },
            "&:hover": {
              bgcolor: isRecording ? "#dc2626" : darkPalette.secondary.dark,
              boxShadow: `0 4px 12px rgba(${
                isRecording ? "239, 68, 68" : "232, 92, 74"
              }, 0.3)`,
            },
            transition: "all 0.2s ease",
          }}
        >
          {isRecording ? "Ghi hình" : "Ghi hình"}
        </Button>

        {/* Close All */}
        <Button
          startIcon={<X size={18} />}
          size="small"
          variant="outlined"
          sx={{
            borderColor: darkPalette.semantic.error,
            color: darkPalette.semantic.error,
            bgcolor: "transparent",
            fontSize: "0.85rem",
            fontWeight: 600,
            textTransform: "none",
            "&:hover": {
              borderColor: "#dc2626",
              color: "#dc2626",
              bgcolor: "rgba(239, 68, 68, 0.1)",
            },
            transition: "all 0.2s ease",
          }}
        >
          Đóng tất cả
        </Button>

        {/* Divider */}
        <Box
          sx={{
            width: "1px",
            height: "28px",
            bgcolor: darkPalette.divider,
            mx: 1,
          }}
        />

        {/* Fullscreen */}
        <Button
          onClick={() => setIsFullscreen(!isFullscreen)}
          variant={isFullscreen ? "contained" : "outlined"}
          size="small"
          endIcon={<Maximize size={18} />}
          sx={{
            borderColor: isFullscreen
              ? darkPalette.accent.main
              : darkPalette.divider,
            color: isFullscreen ? "#fff" : darkPalette.accent.main,
            bgcolor: isFullscreen ? darkPalette.accent.main : "transparent",
            fontSize: "0.85rem",
            fontWeight: 600,
            textTransform: "none",
            "&:hover": {
              bgcolor: isFullscreen
                ? darkPalette.accent.dark
                : `rgba(255, 165, 0, 0.1)`,
              borderColor: darkPalette.accent.main,
            },
            transition: "all 0.2s ease",
          }}
        >
          Toàn màn
        </Button>
      </Stack>
    </Box>
  );
};

export default CameraFooter;
