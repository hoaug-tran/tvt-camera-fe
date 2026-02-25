import { Box, Typography, CircularProgress } from "@mui/material";
import { CameraPlayer } from "@/features/cameras/components/CameraPlayer";
import useStreaming from "@/features/cameras/hooks/useStreaming";

interface VideoGridProps {
  cameraId: number | null;
}

export const VideoGrid = ({ cameraId }: VideoGridProps) => {
  const { isStreaming, isLoading, error } = useStreaming(cameraId);

  if (!cameraId) {
    return (
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          bgcolor: "#0f0d0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ color: "#666" }}>
          Chọn camera để xem trực tiếp
        </Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          bgcolor: "#0f0d0a",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: "#666" }} />
        <Typography sx={{ color: "#666" }}>Đang khởi động stream...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          bgcolor: "#0f0d0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ color: "#ff4444" }}>Lỗi: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        width: "100%",
        bgcolor: "#0f0d0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        p: 2,
        overflow: "hidden",
      }}
    >
      {isStreaming && (
        <CameraPlayer
          cameraId={cameraId}
          isStreaming={true}
          cameraName={`Camera ${cameraId}`}
        />
      )}
    </Box>
  );
};

export default VideoGrid;
