import { create } from "zustand";
import type {
  CameraDevice,
  StreamingState,
} from "@features/cameras/types/camera.types";

interface CamerasState {
  cameras: CameraDevice[];
  selectedCameraId: number | null;
  streamingStates: Record<number, StreamingState>;

  setCameras: (cameras: CameraDevice[]) => void;
  selectCamera: (cameraId: number | null) => void;
  updateStreamingState: (
    cameraId: number,
    state: Partial<StreamingState>,
  ) => void;
  clearStreamingState: (cameraId: number) => void;
}

export const useCamerasStore = create<CamerasState>((set) => ({
  cameras: [],
  selectedCameraId: null,
  streamingStates: {},

  setCameras: (cameras) => set({ cameras }),

  selectCamera: (cameraId) => set({ selectedCameraId: cameraId }),

  updateStreamingState: (cameraId, state) =>
    set((prev) => {
      const currentState = prev.streamingStates[cameraId] ?? {
        hlsUrl: null,
        isLoading: false,
        error: null,
        isStreaming: false,
      };
      return {
        streamingStates: {
          ...prev.streamingStates,
          [cameraId]: {
            ...currentState,
            ...state,
          },
        },
      };
    }),

  clearStreamingState: (cameraId) =>
    set((prev) => {
      const newStates = { ...prev.streamingStates };
      delete newStates[cameraId];
      return { streamingStates: newStates };
    }),
}));

export default useCamerasStore;
