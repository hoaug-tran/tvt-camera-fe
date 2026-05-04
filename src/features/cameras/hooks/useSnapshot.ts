import { useState } from "react";
import { streamingApi } from "@features/cameras/services/streaming.api";

export const useSnapshot = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureMessage, setCaptureMessage] = useState<string | null>(null);
  const [isSuccessful, setIsSuccessful] = useState(false);

  const captureSnapshot = async (
    cameraId: number,
    isSubStream: boolean = false,
  ) => {
    try {
      setIsCapturing(true);

      const blob = await streamingApi.captureSnapshot(cameraId, isSubStream);

      if (navigator.clipboard && navigator.clipboard.write) {
        try {
          const pngBlob =
            blob.type !== "image/png"
              ? new Blob([blob], { type: "image/png" })
              : blob;

          const data = [
            new ClipboardItem({
              "image/png": pngBlob,
            }),
          ];

          await navigator.clipboard.write(data);
          setCaptureMessage("Ảnh đã được sao chép vào clipboard!");
          setIsSuccessful(true);
          return true;
        } catch (clipboardError) {
          console.warn(
            "Clipboard write failed, falling back to download:",
            clipboardError,
          );
          downloadSnapshot(blob, cameraId);
          setCaptureMessage("Ảnh đã được tải xuống!");
          setIsSuccessful(true);
          return true;
        }
      } else {
        downloadSnapshot(blob, cameraId);
        setCaptureMessage(
          "Ảnh đã được tải xuống! (Clipboard không được hỗ trợ)",
        );
        setIsSuccessful(true);
        return true;
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Không thể chụp ảnh";
      setCaptureMessage(errorMsg);
      setIsSuccessful(false);
      console.error("Snapshot capture error:", error);
      return false;
    } finally {
      setIsCapturing(false);
    }
  };

  const downloadSnapshot = (blob: Blob, cameraId: number) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `snapshot_camera_${cameraId}_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    captureSnapshot,
    isCapturing,
    captureMessage,
    isSuccessful,
    setCaptureMessage,
  };
};
