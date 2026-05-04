import type { CameraDevice } from "@features/cameras/types/camera.types";
import { CameraPlayer } from "./CameraPlayer";

interface CameraGridItemProps {
  camera: CameraDevice;
  onSelect: () => void;
  isSelected: boolean;
}

export const CameraGridItem = ({
  camera,
  onSelect,
  isSelected,
}: CameraGridItemProps) => {
  return (
    <div
      className={`relative overflow-hidden rounded-lg border-2 cursor-pointer transition-all ${
        isSelected
          ? "border-blue-500 shadow-lg"
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={onSelect}
    >
      <div className="aspect-video bg-black overflow-hidden">
        <CameraPlayer 
          cameraId={camera.udCameraDeviceID} 
          cameraName={`ID: ${camera.udCameraDeviceID}`}
          isSubStream={true} 
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent p-3 pointer-events-none">
        <p className="text-white text-xs font-medium truncate">
          Camera {camera.udCameraDeviceID}
        </p>
      </div>
    </div>
  );
};
