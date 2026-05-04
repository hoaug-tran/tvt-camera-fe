import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Alert,
  IconButton,
  Stack,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  North as ArrowUp,
  South as ArrowDown,
  West as ArrowLeft,
  East as ArrowRight,
  NorthWest as ArrowUpLeft,
  NorthEast as ArrowUpRight,
  SouthWest as ArrowDownLeft,
  SouthEast as ArrowDownRight,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Devices as DeviceIcon,
} from "@mui/icons-material";
import { darkPalette, darkTextColor } from "@/themes/palette";
import { useCameras } from "@features/cameras/hooks/useCameras";
import { useGrid } from "@/features/cameras/hooks/useGrid";

interface CameraSidebarProps {
  onCameraSelect?: () => void;
}

export const CameraSidebar = ({ onCameraSelect }: CameraSidebarProps) => {
  const { cameras, loading, error } = useCameras(1, 50);
  const {
    slots,
    setCameraInSlot,
    layout,
    selectedSlot,
    setSelectedSlot,
    slotScales,
    setSlotScale
  } = useGrid();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleCameraClick = (cameraId: number) => {
    // Tìm xem camera này đã có trong lưới chưa
    const existingIndex = slots.slice(0, layout).findIndex(id => id === cameraId);

    if (existingIndex !== -1) {
      // Nếu đã có, chỉ cần Focus vào ô đó
      setSelectedSlot(existingIndex);
    } else {
      // Nếu chưa có, tìm ô trống đầu tiên
      const firstEmptySlot = slots.slice(0, layout).findIndex(id => id === null);
      const targetIndex = firstEmptySlot !== -1 ? firstEmptySlot : 0;
      setCameraInSlot(targetIndex, cameraId);
    }

    if (onCameraSelect) onCameraSelect();
  };

  const handleDragStart = (e: React.DragEvent, cameraId: number) => {
    e.dataTransfer.setData("cameraId", cameraId.toString());
    e.dataTransfer.effectAllowed = "move";
  };

  const handleZoom = (direction: "in" | "out") => {
    if (selectedSlot === null) return;

    const currentScale = slotScales[selectedSlot] || 1;
    const delta = direction === "in" ? 0.2 : -0.2;
    setSlotScale(selectedSlot, currentScale + delta);
  };

  const isOnline = (connectionStatus: number | null): boolean =>
    connectionStatus === 1;

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      bgcolor: darkPalette.background.surface,
      borderRight: `1px solid ${darkPalette.divider}`,
      overflow: "hidden"
    }}>
      {/* Header - Cố định */}
      <Box sx={{ p: isMobile ? 1.5 : 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <DeviceIcon sx={{ color: darkPalette.secondary.main, fontSize: isMobile ? 18 : 20 }} />
        <Typography variant="subtitle2" sx={{
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: 1.5,
          color: darkTextColor.primary,
          fontSize: isMobile ? "0.75rem" : "0.85rem"
        }}>
          DANH SÁCH CAMERA
        </Typography>
      </Box>

      {/* Danh sách camera - Vùng cuộn linh hoạt */}
      <Box sx={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        px: 1,
        "&::-webkit-scrollbar": { width: "4px" },
        "&::-webkit-scrollbar-thumb": { bgcolor: "rgba(255,255,255,0.1)", borderRadius: "10px" }
      }}>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={24} color="secondary" />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ m: 1, fontSize: "0.75rem", bgcolor: 'rgba(232, 92, 74, 0.1)', color: darkPalette.secondary.light }}>{error}</Alert>
        )}

        <List>
          {cameras.map((camera) => (
            <ListItem
              key={camera.udCameraDeviceID}
              disablePadding
              sx={{ mb: 0.5 }}
              draggable
              onDragStart={(e) => handleDragStart(e, camera.udCameraDeviceID)}
            >
              <ListItemButton
                selected={slots.slice(0, layout).includes(camera.udCameraDeviceID)}
                onClick={() => handleCameraClick(camera.udCameraDeviceID)}
                sx={{
                  borderRadius: 1,
                  py: isMobile ? 0.8 : 1.1,
                  bgcolor: "transparent",
                  border: "1px solid transparent",
                  "&.Mui-selected": {
                    bgcolor: "rgba(232, 92, 74, 0.12)",
                    borderColor: "rgba(232, 92, 74, 0.3)",
                    "&:hover": { bgcolor: "rgba(232, 92, 74, 0.18)" }
                  },
                  "&:hover": { bgcolor: "rgba(255,255,255,0.03)" }
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                  <Box
                    sx={{
                      width: 8, height: 8, borderRadius: "50%",
                      bgcolor: isOnline(camera.udCameraDeviceConnectionStatus) ? darkPalette.semantic.success : "#555",
                      boxShadow: isOnline(camera.udCameraDeviceConnectionStatus) ? `0 0 8px ${darkPalette.semantic.success}` : "none"
                    }}
                  />
                  <ListItemText
                    primary={camera.udCameraDeviceSuDung || `Camera ${camera.udCameraDeviceID}`}
                    primaryTypographyProps={{
                      fontSize: isMobile ? "0.8rem" : "0.82rem",
                      fontWeight: 600,
                      color: darkTextColor.primary
                    }}
                    secondary={isOnline(camera.udCameraDeviceConnectionStatus) ? "Trực tuyến" : "Ngoại tuyến"}
                    secondaryTypographyProps={{
                      component: "span",
                      sx: {
                        fontSize: "0.68rem",
                        color: darkTextColor.secondary,
                        display: "block",
                        mt: 0.1
                      }
                    }}
                  />
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Footer PTZ & Zoom */}
      <Paper elevation={0} sx={{
        p: isMobile ? 1.5 : 1.8,
        borderTop: `1px solid ${darkPalette.divider}`,
        borderRadius: 0,
        bgcolor: darkPalette.background.surface,
        flexShrink: 0
      }}>
        <Typography variant="caption" sx={{
          color: selectedSlot !== null ? darkPalette.accent.main : "rgba(255,255,255,0.4)",
          fontWeight: 800,
          mb: isMobile ? 1 : 1.5,
          display: "block",
          letterSpacing: 1.2,
          fontSize: isMobile ? "0.65rem" : "0.72rem",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          textShadow: selectedSlot !== null ? `0 0 10px ${darkPalette.accent.main}33` : "none",
          textTransform: 'uppercase'
        }}>
          {selectedSlot !== null ? `ĐIỀU KHIỂN Ô ${selectedSlot + 1}` : 'CHỌN 1 Ô ĐỂ ĐIỀU KHIỂN'}
        </Typography>

        {/* PTZ Grid */}
        <Box sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: isMobile ? 0.75 : 0.8,
          mb: isMobile ? 1.5 : 1.8,
          maxWidth: isMobile ? "150px" : "170px",
          mx: "auto",
          opacity: selectedSlot !== null ? 1 : 0.3,
          pointerEvents: selectedSlot !== null ? 'auto' : 'none',
          transition: "opacity 0.2s"
        }}>
          {(
            [
              { icon: ArrowUpLeft, label: "NW" }, { icon: ArrowUp, label: "N" }, { icon: ArrowUpRight, label: "NE" },
              { icon: ArrowLeft, label: "W" }, null, { icon: ArrowRight, label: "E" },
              { icon: ArrowDownLeft, label: "SW" }, { icon: ArrowDown, label: "S" }, { icon: ArrowDownRight, label: "SE" },
            ] as const
          ).map((item) =>
            item === null ? (
              <Box key="ptz-center" sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(255,255,255,0.03)",
                borderRadius: 1.2,
                aspectRatio: "1/1"
              }}>
                <Typography sx={{ fontSize: isMobile ? 8 : 9, fontWeight: 900, color: "white" }}>PTZ</Typography>
              </Box>
            ) : (
              <IconButton
                key={`ptz-${item.label}`}
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.05)",
                  color: "rgba(255,255,255,0.8)",
                  borderRadius: 1.2,
                  aspectRatio: "1/1",
                  width: "100%",
                  height: "auto",
                  p: isMobile ? 0.5 : 0.6,
                  "&:hover": {
                    bgcolor: darkPalette.secondary.main,
                    color: "#fff",
                    transform: "translateY(-2px)",
                    boxShadow: `0 4px 12px ${darkPalette.secondary.main}44`
                  },
                  transition: "all 0.2s"
                }}
              >
                <item.icon sx={{ fontSize: isMobile ? 16 : 18 }} />
              </IconButton>
            )
          )}
        </Box>

        {/* Zoom Buttons */}
        <Stack direction="row" spacing={1} sx={{
          opacity: selectedSlot !== null ? 1 : 0.3,
          pointerEvents: selectedSlot !== null ? 'auto' : 'none',
          transition: "opacity 0.2s"
        }}>
          <Button
            fullWidth
            size="small"
            variant="outlined"
            startIcon={<ZoomInIcon sx={{ fontSize: isMobile ? 14 : 15 }} />}
            onClick={() => handleZoom("in")}
            sx={{
              fontSize: isMobile ? 10 : 11,
              py: isMobile ? 0.7 : 0.8,
              color: "#fff",
              borderColor: "rgba(255,255,255,0.15)",
              borderRadius: 1.5,
              fontWeight: 700,
              px: 0,
              minWidth: 0,
              "&:hover": {
                borderColor: darkPalette.accent.main,
                bgcolor: `${darkPalette.accent.main}11`,
                color: darkPalette.accent.main
              }
            }}
          >
            PHÓNG TO
          </Button>
          <Button
            fullWidth
            size="small"
            variant="outlined"
            startIcon={<ZoomOutIcon sx={{ fontSize: isMobile ? 14 : 15 }} />}
            onClick={() => handleZoom("out")}
            sx={{
              fontSize: isMobile ? 10 : 11,
              py: isMobile ? 0.7 : 0.8,
              color: "#fff",
              borderColor: "rgba(255,255,255,0.15)",
              borderRadius: 1.5,
              fontWeight: 700,
              px: 0,
              minWidth: 0,
              "&:hover": {
                borderColor: darkPalette.accent.main,
                bgcolor: `${darkPalette.accent.main}11`,
                color: darkPalette.accent.main
              }
            }}
          >
            THU NHỎ
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default CameraSidebar;
