import { httpClient } from "@services/http/http-client";
import type {
  StreamStartResponse,
  StreamStatusResponse,
  StreamHlsUrlResponse,
} from "@features/cameras/types/camera.types";

interface BackendResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export const streamingApi = {
  startStream: async (cameraId: number): Promise<StreamStartResponse> => {
    const response = await httpClient.post<
      BackendResponse<StreamStartResponse>
    >(`/streaming/${cameraId}/stream/start`);
    return response.data.data;
  },

  stopStream: async (cameraId: number): Promise<void> => {
    await httpClient.post(`/streaming/${cameraId}/stream/stop`);
  },

  getStreamStatus: async (cameraId: number): Promise<StreamStatusResponse> => {
    const response = await httpClient.get<
      BackendResponse<StreamStatusResponse>
    >(`/streaming/${cameraId}/stream/status`);
    return response.data.data;
  },

  getHlsUrlFromApi: async (cameraId: number): Promise<StreamHlsUrlResponse> => {
    const response = await httpClient.get<
      BackendResponse<StreamHlsUrlResponse>
    >(`/streaming/${cameraId}/stream/url`);
    return response.data.data;
  },

  buildHlsUrl: (cameraId: number): string => {
    const apiUrl = import.meta.env.VITE_API_URL as string;
    const baseUrl = apiUrl.replace("/api/v1", "");
    return `${baseUrl}/hls/camera_${cameraId}/playlist.m3u8`;
  },
};
