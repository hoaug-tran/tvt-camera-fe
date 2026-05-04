import type { CameraDevice } from "@features/cameras/types/camera.types";
import { X } from "lucide-react";
import { CameraPlayer } from "./CameraPlayer";

interface CameraDetailModalProps {
  camera: CameraDevice;
  onClose: () => void;
}

export const CameraDetailModal = ({
  camera,
  onClose,
}: CameraDetailModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-zinc-900 rounded-xl shadow-2xl max-w-5xl w-full max-h-[95vh] flex flex-col border border-zinc-700">
        <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-t-xl border-b border-zinc-700">
          <div>
            <h2 className="text-xl font-bold text-white">
              Chi Tiết Camera {camera.udCameraDeviceID}
            </h2>
            <p className="text-xs text-zinc-400">Đang phát luồng chính (Main Stream) • Độ trễ thấp</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-700 rounded-full transition-colors text-zinc-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center overflow-hidden bg-black p-2">
           <div className="w-full h-full max-h-[70vh]">
              <CameraPlayer 
                cameraId={camera.udCameraDeviceID}
                cameraName={`Camera ${camera.udCameraDeviceID}`}
                isSubStream={false} 
              />
           </div>
        </div>

        <div className="p-4 border-t border-zinc-700 bg-zinc-800 rounded-b-xl flex justify-between items-center text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
          <span>TVT SDK Protocol</span>
          <span>WebRTC WHEP Connection</span>
        </div>
      </div>
    </div>
  );
};
