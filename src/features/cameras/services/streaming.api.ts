import type { ApiResponse } from "@/types/api.types";
import type {
  StreamStartResponse,
  StreamStatusResponse,
} from "@features/cameras/types/camera.types";
import { httpClient } from "@services/http/http-client";

export const streamingApi = {
  startStream: async (
    cameraId: number,
    isSubStream: boolean = false,
  ): Promise<StreamStartResponse> => {
    const response = await httpClient.post<ApiResponse<StreamStartResponse>>(
      `/streaming/${cameraId}/stream/start?isSubStream=${isSubStream}`,
    );
    return response.data.data;
  },

  stopStream: async (
    cameraId: number,
    isSubStream: boolean = false,
  ): Promise<void> => {
    await httpClient.post(
      `/streaming/${cameraId}/stream/stop?isSubStream=${isSubStream}`,
    );
  },

  getStreamStatus: async (
    cameraId: number,
    isSubStream: boolean = false,
  ): Promise<StreamStatusResponse> => {
    const response = await httpClient.get<ApiResponse<StreamStatusResponse>>(
      `/streaming/${cameraId}/stream/status?isSubStream=${isSubStream}`,
    );
    return response.data.data;
  },

  buildHlsUrl: (cameraId: number, isSubStream: boolean = false): string => {
    const currentHostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = 7014;

    const baseUrl =
      currentHostname === "localhost" || currentHostname === "127.0.0.1"
        ? (import.meta.env.VITE_API_URL as string).replace("/api/v1", "")
        : `${protocol}//${currentHostname}:${port}`;

    const suffix = isSubStream ? "substream" : "main";
    return `${baseUrl}/hls/camera_${cameraId}_${suffix}/index.m3u8`;
  },

  buildWebrtcUrl: (cameraId: number, isSubStream: boolean = false): string => {
    const currentHostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = 7014;

    const baseUrl =
      currentHostname === "localhost" || currentHostname === "127.0.0.1"
        ? (import.meta.env.VITE_API_URL as string).replace("/api/v1", "")
        : `${protocol}//${currentHostname}:${port}`;

    const suffix = isSubStream ? "substream" : "main";
    return `${baseUrl}/webrtc/camera_${cameraId}_${suffix}/whep`;
  },

  buildRtspUrl: (cameraId: number, isSubStream: boolean = false): string => {
    const suffix = isSubStream ? "substream" : "main";
    return `rtsp://localhost:8554/camera_${cameraId}_${suffix}`;
  },

  captureSnapshot: async (
    cameraId: number,
    isSubStream: boolean = false,
  ): Promise<Blob> => {
    const response = await httpClient.get<Blob>(
      `/streaming/${cameraId}/snapshot?isSubStream=${isSubStream}`,
      { responseType: "blob" },
    );
    return response.data;
  },
};
