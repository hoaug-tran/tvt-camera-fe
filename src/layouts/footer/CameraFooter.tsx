import { useState, useEffect } from "react";
import {
  Button,
  Stack,
  Box,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  PhotoCamera as CameraIcon,
  Videocam as VideoIcon,
  Close as CloseIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Filter1 as Layout1Icon,
  GridView as Layout4Icon,
  Apps as Layout9Icon,
  ViewComfy as Layout16Icon,
} from "@mui/icons-material";
import { useGrid } from "@/features/cameras/hooks/useGrid";
import { useCamerasStore } from "@features/cameras/stores/cameras.store";
import { useSnapshot } from "@features/cameras/hooks/useSnapshot";
import { darkPalette, darkTextColor } from "@/themes/palette";

export const CameraFooter = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { layout, setLayout, clearAllSlots, selectedSlot, slots } = useGrid();
  const { cameras, selectCamera } = useCamerasStore();

  const {
    captureSnapshot,
    isCapturing,
    captureMessage,
    isSuccessful,
    setCaptureMessage,
  } = useSnapshot();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isFullscreen, setIsFullscreen] = useState(false);

  const focusedCameraId = selectedSlot != null ? slots[selectedSlot] : null;

  useEffect(() => {
    if (cameras.length === 1 && focusedCameraId == null) {
      selectCamera(cameras[0].udCameraDeviceID);
    }
  }, [cameras, focusedCameraId, selectCamera]);

  const layoutOptions = [
    { id: 1, icon: Layout1Icon, label: "1" },
    { id: 4, icon: Layout4Icon, label: "4" },
    { id: 9, icon: Layout9Icon, label: "9" },
    { id: 16, icon: Layout16Icon, label: "16" },
  ];

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleCaptureSnapshot = async () => {
    if (focusedCameraId == null) {
      setCaptureMessage("Vui lòng chọn camera để chụp ảnh");
      setSnackbarOpen(true);
      return;
    }

    try {
      // Try main stream first, then fallback to substream if it fails
      let snapshot: boolean = false;

      // Try main stream
      try {
        await captureSnapshot(focusedCameraId, false);
        snapshot = true;
      } catch (mainError) {
        console.debug(
          "Main stream snapshot failed, trying substream:",
          mainError,
        );

        // Fallback to substream
        try {
          await captureSnapshot(focusedCameraId, true);
          snapshot = true;
        } catch (subError) {
          console.error("Both main and sub stream snapshots failed:", subError);
          throw subError;
        }
      }

      if (snapshot) {
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("[CameraFooter] Snapshot error:", error);
      setCaptureMessage(
        `Lỗi: ${error instanceof Error ? error.message : "Không xác định"}`,
      );
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          bgcolor: darkPalette.background.surface,
          borderTop: `1px solid ${darkPalette.divider}`,
          p: { xs: 1, sm: 1.5 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "nowrap",
          gap: 1,
        }}
      >
        <Stack direction="row" spacing={0.5}>
          {layoutOptions.map((option) => (
            <Tooltip
              key={option.id}
              title={`Chế độ lưới ${option.label}`}
              arrow
            >
              <Button
                onClick={() => setLayout(option.id as 1 | 4 | 9 | 16)}
                variant={layout === option.id ? "contained" : "outlined"}
                size="small"
                sx={{
                  minWidth: { xs: "40px", sm: "55px" },
                  px: { xs: 0, sm: 1.5 },
                  height: "38px",
                  borderRadius: 1.5,
                  fontSize: "0.85rem",
                  fontWeight: layout === option.id ? 700 : 500,
                  color: layout === option.id ? "#fff" : darkTextColor.primary,
                  borderColor:
                    layout === option.id
                      ? darkPalette.secondary.main
                      : darkPalette.divider,
                  bgcolor:
                    layout === option.id
                      ? darkPalette.secondary.main
                      : "transparent",
                  "& .MuiButton-startIcon": {
                    mr: { xs: 0, sm: 0.5 },
                    ml: { xs: 0, sm: -0.5 },
                  },
                  "&:hover": {
                    bgcolor:
                      layout === option.id
                        ? darkPalette.secondary.dark
                        : "rgba(255,255,255,0.05)",
                    borderColor: darkPalette.secondary.main,
                  },
                }}
                startIcon={<option.icon sx={{ fontSize: 18 }} />}
              >
                {!isMobile && option.label}
              </Button>
            </Tooltip>
          ))}
        </Stack>

        <Stack
          direction="row"
          spacing={{ xs: 0.5, sm: 1.5 }}
          alignItems="center"
        >
          <Tooltip title="Chụp màn hình" arrow>
            <IconButton
              onClick={handleCaptureSnapshot}
              disabled={isCapturing}
              size="medium"
              sx={{
                bgcolor: darkPalette.background.elevated,
                color: darkTextColor.primary,
                borderRadius: 1.5,
                width: 38,
                height: 38,
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.1)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.2s",
              }}
            >
              <CameraIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip
            title={isRecording ? "Dừng ghi hình" : "Bắt đầu ghi hình"}
            arrow
          >
            <IconButton
              onClick={() => setIsRecording(!isRecording)}
              sx={{
                bgcolor: isRecording
                  ? "error.main"
                  : darkPalette.background.elevated,
                color: isRecording ? "#fff" : darkTextColor.primary,
                borderRadius: 1.5,
                width: 38,
                height: 38,
                "&:hover": {
                  bgcolor: isRecording ? "error.dark" : "rgba(255,255,255,0.1)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.2s",
                animation: isRecording ? "pulse 1.5s infinite" : "none",
                "@keyframes pulse": {
                  "0%": { boxShadow: "0 0 0 0 rgba(232, 92, 74, 0.4)" },
                  "70%": { boxShadow: "0 0 0 10px rgba(232, 92, 74, 0)" },
                  "100%": { boxShadow: "0 0 0 0 rgba(232, 92, 74, 0)" },
                },
              }}
            >
              <VideoIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Box
            sx={{
              width: "1px",
              height: "24px",
              bgcolor: darkPalette.divider,
              mx: { xs: 0.2, sm: 0.5 },
            }}
          />

          <Tooltip title="Đóng tất cả camera" arrow>
            <Button
              size="small"
              variant="outlined"
              onClick={clearAllSlots}
              startIcon={<CloseIcon />}
              sx={{
                height: "38px",
                minWidth: { xs: "40px", sm: "140px" },
                px: { xs: 0, sm: 2 },
                borderRadius: 1.5,
                fontWeight: 600,
                color: darkPalette.semantic.error,
                borderColor: darkPalette.divider,
                justifyContent: "center",
                "& .MuiButton-startIcon": {
                  m: { xs: 0, sm: 0 },
                  mr: { xs: 0, sm: 1 },
                },
                "&:hover": {
                  borderColor: darkPalette.semantic.error,
                  bgcolor: "rgba(232, 92, 74, 0.1)",
                },
              }}
            >
              {!isMobile && "ĐÓNG TẤT CẢ"}
            </Button>
          </Tooltip>

          <Tooltip
            title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
            arrow
          >
            <IconButton
              onClick={handleToggleFullscreen}
              sx={{
                bgcolor: darkPalette.accent.main,
                color: "#fff",
                borderRadius: 1.5,
                width: 38,
                height: 38,
                "&:hover": {
                  bgcolor: darkPalette.accent.dark,
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s",
              }}
            >
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => {
          setSnackbarOpen(false);
          setCaptureMessage(null);
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => {
            setSnackbarOpen(false);
            setCaptureMessage(null);
          }}
          severity={isSuccessful ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {captureMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
