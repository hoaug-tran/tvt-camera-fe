import { useEffect } from "react";
import { CircularProgress, Box, Container, Typography } from "@mui/material";
import { useCameraManagement } from "@features/cameras/hooks/useCameraManagement";
import { CameraGrid } from "@features/cameras/components/CameraGrid";
import { Navbar } from "@layouts/header/Navbar";

export const CameraViewerPage = () => {
  const { cameras, loading, error, fetchCameras } = useCameraManagement();

  useEffect(() => {
    fetchCameras();
  }, [fetchCameras]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#0a0e27",
      }}
    >
      <Navbar />

      <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
        <Typography
          variant="h4"
          sx={{ color: "white", mb: 4, fontWeight: 600 }}
        >
          Camera Viewer
        </Typography>

        {error && (
          <Typography sx={{ color: "#ff6b6b", mb: 2 }}>
            Error loading cameras: {error}
          </Typography>
        )}

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 400,
            }}
          >
            <CircularProgress />
          </Box>
        ) : cameras.length === 0 ? (
          <Typography sx={{ color: "#888", textAlign: "center", py: 8 }}>
            No cameras available
          </Typography>
        ) : (
          <CameraGrid cameras={cameras} isLoading={loading} />
        )}
      </Container>
    </Box>
  );
};
