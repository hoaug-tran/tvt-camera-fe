import { useState, useCallback } from "react";
import type { CameraDevice } from "@features/cameras/types/camera.types";
import { useCamerasStore } from "@features/cameras/stores/cameras.store";
import { CameraGridItem } from "./CameraGridItem";
import { CameraDetailModal } from "./CameraDetailModal";

interface CameraGridProps {
  cameras: CameraDevice[];
  isLoading?: boolean;
}

export const CameraGrid = ({ cameras }: CameraGridProps) => {
  const [selectedCameraId, setSelectedCameraId] = useState<number | null>(null);
  const { selectCamera } = useCamerasStore();

  const selectedCamera = cameras.find(
    (cam) => cam.udCameraDeviceID === selectedCameraId,
  );

  const handleSelectCamera = useCallback(
    (cameraId: number) => {
      setSelectedCameraId(cameraId);
      selectCamera(cameraId);
    },
    [selectCamera],
  );

  const handleCloseDetail = useCallback(() => {
    setSelectedCameraId(null);
    selectCamera(null);
  }, [selectCamera]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cameras.map((camera) => (
          <CameraGridItem
            key={camera.udCameraDeviceID}
            camera={camera}
            onSelect={() => handleSelectCamera(camera.udCameraDeviceID)}
            isSelected={selectedCameraId === camera.udCameraDeviceID}
          />
        ))}
      </div>

      {selectedCamera && (
        <CameraDetailModal
          camera={selectedCamera}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
};
