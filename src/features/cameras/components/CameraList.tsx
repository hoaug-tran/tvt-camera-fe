import { Box, CircularProgress, Alert, Typography } from "@mui/material";
import { useCameras } from "@features/cameras/hooks/useCameras";
import { useGrid } from "@/features/cameras/hooks/useGrid";

export const CameraList = () => {
  const { cameras, loading, error } = useCameras();
  const { slots, setCameraInSlot, layout } = useGrid();

  const handleCameraClick = (cameraId: number) => {
    const firstEmptySlot = slots
      .slice(0, layout)
      .findIndex((id) => id === null);

    if (firstEmptySlot !== -1) {
      setCameraInSlot(firstEmptySlot, cameraId);
    } else {
      setCameraInSlot(0, cameraId);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 1 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      {cameras.length > 0 ? (
        <Box>
          {cameras.map((camera) => (
            <Box
              key={camera.udCameraDeviceID}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData(
                  "cameraId",
                  camera.udCameraDeviceID.toString(),
                );
                e.dataTransfer.effectAllowed = "move";
              }}
              onClick={() => handleCameraClick(camera.udCameraDeviceID)}
              sx={{
                p: 1.5,
                mb: 1,
                borderRadius: 1,
                border: "1px solid rgba(255, 255, 255, 0.05)",
                bgcolor: "rgba(255, 255, 255, 0.03)",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  bgcolor: "rgba(232, 92, 74, 0.15)",
                  borderColor: "rgba(232, 92, 74, 0.3)",
                  transform: "translateX(4px)",
                },
                "&:active": {
                  bgcolor: "rgba(232, 92, 74, 0.25)",
                },
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "#eee", fontWeight: 500 }}
              >
                {camera.udCameraDeviceSuDung ||
                  `Camera ${camera.udCameraDeviceID}`}
              </Typography>
              <Typography variant="caption" sx={{ color: "#666" }}>
                IP: {camera.udCameraDeviceIpAdress}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : (
        <Alert severity="info">Không có camera nào</Alert>
      )}
    </Box>
  );
};

export default CameraList;
