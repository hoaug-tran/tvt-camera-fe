import { Box, CircularProgress, Alert } from "@mui/material";
import { useCameras } from "@features/cameras/hooks/useCameras";

export const CameraList = () => {
  const { cameras, loading, error } = useCameras();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      {cameras.length > 0 ? (
        <Box>
          {cameras.map((camera) => (
            <div key={camera.udCameraDeviceID}>
              {camera.udCameraDeviceSuDung ??
                `Camera ${camera.udCameraDeviceID}`}
            </div>
          ))}
        </Box>
      ) : (
        <Alert severity="info">Không có camera nào</Alert>
      )}
    </Box>
  );
};

export default CameraList;
