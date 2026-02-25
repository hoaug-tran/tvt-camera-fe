import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  IconButton,
  Stack,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowDownRight,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { darkPalette } from "@/themes/palette";
import { useCameras } from "@features/cameras/hooks/useCameras";

interface CameraSidebarProps {
  selectedCameraId: number | null;
  onSelectCamera: (cameraId: number) => void;
}

export const CameraSidebar = ({
  selectedCameraId,
  onSelectCamera,
}: CameraSidebarProps) => {
  const [zoom, setZoom] = useState(1);
  const { cameras, loading, error } = useCameras();

  const handleZoom = (direction: "in" | "out") => {
    if (direction === "in") {
      setZoom(Math.min(zoom + 0.1, 3));
    } else {
      setZoom(Math.max(zoom - 0.1, 1));
    }
  };

  const getCameraName = (suDung: string | null, id: number): string =>
    suDung?.trim() || `Camera ${id}`;

  const isOnline = (connectionStatus: number | null): boolean =>
    connectionStatus === 1;

  return (
    <Paper
      sx={{
        width: "280px",
        height: "calc(100vh - 64px)",
        bgcolor: darkPalette.background.surface,
        borderRadius: 0,
        display: "flex",
        flexDirection: "column",
        boxShadow: "none",
        border: "none",
        borderRight: `1px solid ${darkPalette.divider}`,
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography
          sx={{
            fontSize: "0.75rem",
            fontWeight: 600,
            color: darkPalette.neutral[400],
            textTransform: "uppercase",
            letterSpacing: "0.3px",
          }}
        >
          Danh sách thiết bị
        </Typography>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <CircularProgress
            size={20}
            sx={{ color: darkPalette.secondary.main }}
          />
        </Box>
      )}

      {error && (
        <Box sx={{ px: 1, pb: 1 }}>
          <Alert severity="error" sx={{ fontSize: "0.75rem" }}>
            {error}
          </Alert>
        </Box>
      )}

      <List
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 1,
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-track": { bgcolor: darkPalette.neutral[900] },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: darkPalette.neutral[700],
            borderRadius: "3px",
            "&:hover": { bgcolor: darkPalette.neutral[600] },
          },
        }}
      >
        {cameras.map((camera) => (
          <ListItem
            key={camera.udCameraDeviceID}
            disablePadding
            sx={{ mb: 0.5 }}
          >
            <ListItemButton
              selected={selectedCameraId === camera.udCameraDeviceID}
              onClick={() => onSelectCamera(camera.udCameraDeviceID)}
              sx={{
                borderRadius: "6px",
                bgcolor:
                  selectedCameraId === camera.udCameraDeviceID
                    ? `rgba(232, 92, 74, 0.15)`
                    : "transparent",
                borderLeft:
                  selectedCameraId === camera.udCameraDeviceID
                    ? `3px solid ${darkPalette.secondary.main}`
                    : "3px solid transparent",
                "&:hover": { bgcolor: `rgba(232, 92, 74, 0.1)` },
                transition: "all 0.2s ease",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    bgcolor: isOnline(camera.udCameraDeviceConnectionStatus)
                      ? "#6ba82f"
                      : darkPalette.neutral[600],
                    flexShrink: 0,
                  }}
                />
                <ListItemText
                  primary={getCameraName(
                    camera.udCameraDeviceSuDung,
                    camera.udCameraDeviceID,
                  )}
                  primaryTypographyProps={{
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    color: darkPalette.neutral[50],
                  }}
                  secondary={
                    isOnline(camera.udCameraDeviceConnectionStatus)
                      ? "online"
                      : "offline"
                  }
                  secondaryTypographyProps={{
                    fontSize: "0.75rem",
                    color: darkPalette.neutral[400],
                  }}
                />
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ bgcolor: darkPalette.divider }} />

      <Box sx={{ p: 2 }}>
        <Typography
          sx={{
            fontSize: "0.8rem",
            fontWeight: 600,
            color: darkPalette.neutral[400],
            textTransform: "uppercase",
            mb: 1.5,
            letterSpacing: "0.5px",
          }}
        >
          Điều khiển PTZ
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
            mb: 2,
            p: 1,
            bgcolor: darkPalette.neutral[900],
            borderRadius: "8px",
            border: `1px solid ${darkPalette.divider}`,
          }}
        >
          {(
            [
              { icon: ArrowUpLeft, label: "up-left" },
              { icon: ArrowUp, label: "up" },
              { icon: ArrowUpRight, label: "up-right" },
              { icon: ArrowLeft, label: "left" },
              null,
              { icon: ArrowRight, label: "right" },
              { icon: ArrowDownLeft, label: "down-left" },
              { icon: ArrowDown, label: "down" },
              { icon: ArrowDownRight, label: "down-right" },
            ] as const
          ).map((item) =>
            item === null ? (
              <Box
                key="ptz-center"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: darkPalette.neutral[800],
                  border: `1px solid ${darkPalette.divider}`,
                  borderRadius: "6px",
                  color: darkPalette.neutral[500],
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: "default",
                }}
              >
                PTZ
              </Box>
            ) : (
              <IconButton
                key={item.label}
                size="small"
                sx={{
                  width: "100%",
                  bgcolor: darkPalette.neutral[800],
                  color: darkPalette.secondary.main,
                  border: `1px solid ${darkPalette.divider}`,
                  borderRadius: "6px",
                  "&:hover": {
                    bgcolor: darkPalette.neutral[700],
                    borderColor: darkPalette.secondary.main,
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <item.icon size={16} />
              </IconButton>
            ),
          )}
        </Box>

        <Typography
          sx={{
            fontSize: "0.8rem",
            fontWeight: 600,
            color: darkPalette.neutral[400],
            textTransform: "uppercase",
            mb: 1,
            letterSpacing: "0.5px",
          }}
        >
          Zoom ({(zoom * 100).toFixed(0)}%)
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            fullWidth
            onClick={() => handleZoom("in")}
            startIcon={<ZoomIn size={18} />}
            sx={{
              borderColor: darkPalette.secondary.main,
              color: darkPalette.secondary.main,
              bgcolor: "transparent",
              fontSize: "0.8rem",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                bgcolor: `rgba(232, 92, 74, 0.1)`,
                borderColor: darkPalette.secondary.main,
              },
            }}
          >
            Zoom +
          </Button>
          <Button
            variant="outlined"
            size="small"
            fullWidth
            onClick={() => handleZoom("out")}
            startIcon={<ZoomOut size={18} />}
            sx={{
              borderColor: darkPalette.secondary.main,
              color: darkPalette.secondary.main,
              bgcolor: "transparent",
              fontSize: "0.8rem",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                bgcolor: `rgba(232, 92, 74, 0.1)`,
                borderColor: darkPalette.secondary.main,
              },
            }}
          >
            Zoom -
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default CameraSidebar;
