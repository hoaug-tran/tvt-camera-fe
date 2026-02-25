import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import HLS from "hls.js";
import { streamingApi } from "@features/cameras/services/streaming.api";

interface CameraPlayerProps {
  cameraId: number;
  isStreaming: boolean;
  cameraName?: string;
}

export const CameraPlayer = ({
  cameraId,
  isStreaming,
  cameraName = "Camera",
}: CameraPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hlsError, setHlsError] = useState<{
    message: string;
    cameraId: number;
    isStreaming: boolean;
  } | null>(null);
  const currentError =
    hlsError?.cameraId === cameraId && hlsError?.isStreaming === isStreaming
      ? hlsError.message
      : null;
  const hlsUrl = isStreaming ? streamingApi.buildHlsUrl(cameraId) : null;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hlsUrl) return;

    if (!HLS.isSupported()) {
      video.src = hlsUrl;
      video.load();
      return;
    }

    const hls = new HLS({
      enableWorker: true,
      lowLatencyMode: true,
      xhrSetup: (xhr) => {
        xhr.withCredentials = false;
      },
      maxLoadingDelay: 4,
      minAutoBitrate: 0,
    });

    hls.on(HLS.Events.MANIFEST_PARSED, () => {
      video.play().catch(() => {});
    });

    hls.on(HLS.Events.ERROR, (_event, data) => {
      if (data.fatal) {
        hls.destroy();
        setHlsError({
          message: "Không thể phát video từ camera này. Vui lòng thử lại.",
          cameraId,
          isStreaming,
        });
      }
    });

    hls.attachMedia(video);
    hls.loadSource(hlsUrl);

    return () => {
      hls.destroy();
    };
  }, [cameraId, isStreaming, hlsUrl]);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "4px",
        overflow: "hidden",
      }}
    >
      {!hlsUrl && (
        <Typography sx={{ color: "#666" }}>
          Đang tải stream {cameraName}
        </Typography>
      )}

      {hlsUrl && currentError && (
        <Typography sx={{ color: "#ff4444", px: 2, textAlign: "center" }}>
          {currentError}
        </Typography>
      )}

      {hlsUrl && !currentError && (
        <>
          <video
            ref={videoRef}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
            controls
            autoPlay
            muted
            crossOrigin="anonymous"
          />
          <Box
            sx={{
              position: "absolute",
              top: "10px",
              left: "10px",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              color: "#fff",
              px: 1.5,
              py: 0.5,
              borderRadius: "4px",
              fontSize: "12px",
              fontFamily: "monospace",
            }}
          >
            {cameraName}
          </Box>
        </>
      )}
    </Box>
  );
};
