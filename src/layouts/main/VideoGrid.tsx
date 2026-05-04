import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { CameraPlayer } from "@/features/cameras/components/CameraPlayer";
import { useGrid } from "@/features/cameras/context/useGrid";
import { useCameras } from "@/features/cameras/hooks/useCameras";
import { darkPalette } from "@/themes/palette";

export const VideoGrid = () => {
  const {
    layout,
    slots,
    setCameraInSlot,
    swapSlots,
    selectedSlot,
    setSelectedSlot,
  } = useGrid();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { cameras } = useCameras();

  const gridColumns = Math.sqrt(layout);

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceSlotIndex = e.dataTransfer.getData("sourceSlotIndex");
    const cameraIdStr = e.dataTransfer.getData("cameraId");

    if (sourceSlotIndex !== "") {
      swapSlots(parseInt(sourceSlotIndex), targetIndex);
    } else if (cameraIdStr) {
      setCameraInSlot(targetIndex, parseInt(cameraIdStr));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("sourceSlotIndex", index.toString());
  };

  const activeSlots = slots.slice(0, layout);

  return (
    <Box
      sx={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : `repeat(${gridColumns}, 1fr)`,
        gridTemplateRows: isMobile
          ? layout === 1
            ? "1fr"
            : `repeat(${Math.ceil(layout)}, 220px)`
          : `repeat(${gridColumns}, 1fr)`,
        gap: 0.75,
        p: 0.75,
        bgcolor: darkPalette.background.default,
        overflowY: "auto",
        alignItems: isMobile && layout === 1 ? "center" : "stretch",
        justifyContent: "center",
        height: "100%",
        minHeight: 0,
      }}
    >
      {activeSlots.map((cameraId, index) => {
        const cameraInfo = cameras.find((c) => c.udCameraDeviceID === cameraId);
        const isSelected = selectedSlot === index;
        const focusColor = darkPalette.secondary.main;

        return (
          <Box
            key={`${index}-${cameraId || "empty"}`}
            draggable={cameraId !== null}
            onDragStart={(e) => handleDragStart(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={handleDragOver}
            onClick={() => setSelectedSlot(index)}
            sx={{
              position: "relative",
              width: "100%",
              height: isMobile ? (layout === 1 ? "auto" : "220px") : "100%",
              aspectRatio: isMobile && layout === 1 ? "16/9" : "auto",
              border: `2.5px solid ${isSelected ? focusColor : darkPalette.divider}`,
              bgcolor: darkPalette.background.surface,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              borderRadius: 2,
              cursor: cameraId ? "grab" : "pointer",
              transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
              zIndex: isSelected ? 10 : 1,
              "&:hover": {
                borderColor: isSelected
                  ? focusColor
                  : darkPalette.secondary.main,
                bgcolor: "rgba(255,255,255,0.02)",
              },
            }}
          >
            {cameraId ? (
              <CameraPlayer
                cameraId={cameraId}
                cameraName={
                  cameraInfo?.udCameraDeviceSuDung || `Camera ${cameraId}`
                }
                isSubStream={layout > 1}
                slotIndex={index}
              />
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  opacity: 0.4,
                  pointerEvents: "none",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: darkPalette.neutral[400],
                    letterSpacing: 0.5,
                    fontWeight: 700,
                  }}
                >
                  Ô TRỐNG {index + 1}
                </Typography>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};
