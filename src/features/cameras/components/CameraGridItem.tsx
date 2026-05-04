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
    <button
      type="button"
      aria-pressed={isSelected}
      aria-label={`Chọn camera ${camera.udCameraDeviceID}`}
      className={`relative w-full overflow-hidden rounded-lg border-2 cursor-pointer transition-all text-left p-0 ${
        isSelected
          ? "border-blue-500 shadow-lg"
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={onSelect}
    >
      <div className="aspect-video bg-slate-950 overflow-hidden">
        <CameraPlayer 
          cameraId={camera.udCameraDeviceID} 
          cameraName={`ID: ${camera.udCameraDeviceID}`}
          isSubStream={true} 
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent p-3 pointer-events-none">
        <p className="text-white text-xs font-medium truncate">
          Camera {camera.udCameraDeviceID}
        </p>
      </div>
    </button>
  );
};
