import { memo, useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Button,
  Stack,
} from "@mui/material";
import {
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  ZoomOutMap as ResetZoomIcon,
  Close as CloseIcon,
  Hd as HdIcon,
  Sd as SdIcon,
  ErrorOutline as ErrorIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useStreaming } from "@features/cameras/hooks/useStreaming";
import { useGrid } from "@/features/cameras/context/useGrid";
import { darkPalette } from "@/themes/palette";

interface CameraPlayerProps {
  cameraId: number;
  cameraName?: string;
  isSubStream?: boolean;
  slotIndex?: number; // Chuyển thành optional để dùng được ở các component lẻ
}

export const CameraPlayer = memo(
  ({
    cameraId,
    cameraName = "Camera",
    isSubStream = true,
    slotIndex,
  }: CameraPlayerProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const { slotScales, setSlotScale, removeCameraById } = useGrid();

    // Nếu không có slotIndex (dùng lẻ), mặc định scale = 1
    const scale =
      slotIndex !== undefined && slotScales ? slotScales[slotIndex] || 1 : 1;

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [webrtcError, setWebrtcError] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const [internalSubStream, setInternalSubStream] = useState(isSubStream);
    const [retryCount, setRetryCount] = useState(0);

    const {
      hlsUrl: webrtcUrl,
      isLoading,
      error,
      isStreaming,
    } = useStreaming(cameraId, internalSubStream);

    useEffect(() => {
      setInternalSubStream(isSubStream);
    }, [isSubStream]);

    useEffect(() => {
      let pc: RTCPeerConnection | null = null;
      let isMounted = true;

      const connectWebRTC = async () => {
        if (!webrtcUrl || !videoRef.current || !isMounted) return;

        try {
          setWebrtcError(null);
          pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
          });

          pc.ontrack = (event) => {
            if (videoRef.current && event.streams[0]) {
              videoRef.current.srcObject = event.streams[0];
            }
          };

          pc.addTransceiver("video", { direction: "recvonly" });
          pc.addTransceiver("audio", { direction: "recvonly" });

          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);

          const response = await fetch(webrtcUrl, {
            method: "POST",
            body: pc.localDescription?.sdp,
            headers: { "Content-Type": "application/sdp" },
          });

          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);

          const answer = await response.text();
          if (isMounted) {
            await pc.setRemoteDescription(
              new RTCSessionDescription({ type: "answer", sdp: answer }),
            );
          }
        } catch (err) {
          console.error("WebRTC Error:", err);
          if (isMounted) setWebrtcError("Không thể kết nối đến camera.");
        }
      };

      connectWebRTC();
      return () => {
        isMounted = false;
        pc?.close();
      };
    }, [webrtcUrl, retryCount]);

    const handleWheel = (e: React.WheelEvent) => {
      if (!isStreaming) return;
      const delta = e.deltaY > 0 ? -0.2 : 0.2;
      const newScale = Math.min(Math.max(scale + delta, 1), 5);

      if (slotIndex !== undefined) {
        setSlotScale(slotIndex, newScale);
      } else {
        // Logic scroll zoom nội bộ cho component lẻ (nếu cần)
      }

      if (newScale === 1) setPosition({ x: 0, y: 0 });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      if (scale > 1) {
        setIsDragging(true);
        setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
      }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (isDragging && scale > 1) {
        setPosition({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
      }
    };

    const toggleFullScreen = () => {
      if (!containerRef.current) return;
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    };

    const resetZoom = () => {
      if (slotIndex !== undefined) {
        setSlotScale(slotIndex, 1);
      }
      setPosition({ x: 0, y: 0 });
    };

    const handleRetry = () => {
      setRetryCount((prev) => prev + 1);
    };

    const displayError = error || webrtcError;

    return (
      <>
        <Box
          ref={containerRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
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
            cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "default",
            "&:hover .player-controls": { display: "flex" },
          }}
        >
          {isLoading && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                bgcolor: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(10px)",
              }}
            >
              <CircularProgress
                size={30}
                sx={{ color: darkPalette.accent.main }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "#fff",
                  fontWeight: 800,
                  letterSpacing: 1.5,
                  textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                }}
              >
                ĐANG TẢI LUỒNG {internalSubStream ? "SD" : "HD"}...
              </Typography>
            </Box>
          )}

          {!isLoading && displayError && (
            <Box
              sx={{
                textAlign: "center",
                p: 2,
                bgcolor: "rgba(0,0,0,0.8)",
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.2,
              }}
            >
              <ErrorIcon
                color="error"
                sx={{
                  fontSize: {
                    xs: 28,
                    sm: 36,
                    md: 48,
                  },
                }}
              />

              <Typography
                sx={{
                  color: "#ff4444",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  fontSize: {
                    xs: "10px",
                    sm: "12px",
                    md: "14px",
                  },
                }}
              >
                LỖI KẾT NỐI
              </Typography>

              <Typography
                sx={{
                  color: "#aaa",
                  px: 1,
                  fontSize: {
                    xs: "9px",
                    sm: "10px",
                    md: "11px",
                  },
                }}
              >
                {displayError}
              </Typography>

              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  startIcon={<RefreshIcon />}
                  onClick={handleRetry}
                  sx={{
                    px: { xs: 1.2, sm: 1.6 },
                    py: { xs: 0.4, sm: 0.6 },
                    fontSize: { xs: "9px", sm: "10px", md: "11px" },
                    fontWeight: 700,
                    borderRadius: 1.5,
                  }}
                >
                  THỬ LẠI
                </Button>

                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<CloseIcon />}
                  onClick={() => removeCameraById(cameraId)}
                  sx={{
                    px: { xs: 1.2, sm: 1.6 },
                    py: { xs: 0.4, sm: 0.6 },
                    fontSize: { xs: "9px", sm: "10px", md: "11px" },
                    fontWeight: 700,
                    color: "#fff",
                    borderColor: "#444",
                    borderRadius: 1.5,
                  }}
                >
                  ĐÓNG
                </Button>
              </Stack>
            </Box>
          )}

          {isStreaming && !displayError && (
            <>
              <video
                ref={videoRef}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                  transition: isDragging ? "none" : "transform 0.1s ease-out",
                }}
                autoPlay
                playsInline
                muted
              />

              {/* Badge góc dưới bên trái */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 12,
                  left: 12,
                  display: "flex",
                  gap: 1,
                  pointerEvents: "none",
                }}
              >
                <Box
                  sx={{
                    bgcolor: "rgba(0,0,0,0.7)",
                    px: 1.2,
                    py: 0.5,
                    borderRadius: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    border: `1.5px solid ${internalSubStream ? "#ffa726" : "#4caf50"}`,
                  }}
                >
                  {internalSubStream ? (
                    <SdIcon sx={{ fontSize: 18, color: "#ffa726" }} />
                  ) : (
                    <HdIcon sx={{ fontSize: 18, color: "#4caf50" }} />
                  )}
                  <Typography
                    sx={{
                      fontSize: "11px",
                      fontWeight: 800,
                      color: "#fff",
                      letterSpacing: 0.5,
                    }}
                  >
                    {cameraName}
                  </Typography>
                </Box>
              </Box>

              {/* Controls góc dưới bên phải */}
              <Box
                className="player-controls"
                sx={{
                  position: "absolute",
                  bottom: 12,
                  right: 12,
                  display: "none",
                  gap: 0.8,
                  bgcolor: "rgba(0,0,0,0.75)",
                  p: 0.8,
                  borderRadius: 2,
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(4px)",
                }}
              >
                {scale > 1 && (
                  <IconButton
                    size="medium"
                    onClick={resetZoom}
                    sx={{ color: "#fff", p: 1 }}
                  >
                    <ResetZoomIcon />
                  </IconButton>
                )}

                <IconButton
                  size="medium"
                  onClick={toggleFullScreen}
                  sx={{ color: "#fff", p: 1 }}
                >
                  {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                </IconButton>

                <IconButton
                  size="medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    setInternalSubStream(!internalSubStream);
                  }}
                  sx={{
                    color: internalSubStream ? "#ffa726" : "#4caf50",
                    p: 1,
                    bgcolor: "rgba(255,255,255,0.05)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
                  }}
                >
                  {internalSubStream ? <SdIcon /> : <HdIcon />}
                </IconButton>

                <IconButton
                  size="medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCameraById(cameraId);
                  }}
                  sx={{ color: "#fff", p: 1 }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </>
          )}
        </Box>
      </>
    );
  },
);

export default CameraPlayer;
