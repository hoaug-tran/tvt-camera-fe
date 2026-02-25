import { useState } from "react";
import { Box } from "@mui/material";
import { CameraSidebar } from "./CameraSidebar";
import { VideoGrid } from "@layouts/main/VideoGrid";
import { CameraFooter } from "@layouts/footer/CameraFooter";

export const CameraPanel = () => {
  const [selectedCameraId, setSelectedCameraId] = useState<number | null>(null);

  return (
    <Box
      sx={{
        display: "flex",
        height: "calc(100vh - 64px)",
      }}
    >
      <CameraSidebar
        selectedCameraId={selectedCameraId}
        onSelectCamera={setSelectedCameraId}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <VideoGrid cameraId={selectedCameraId} />
        <CameraFooter />
      </Box>
    </Box>
  );
};

export default CameraPanel;
