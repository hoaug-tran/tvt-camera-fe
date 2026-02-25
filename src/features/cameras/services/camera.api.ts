import { httpClient } from "@services/http/http-client";
import type {
  CameraDevice,
  CreateCameraRequest,
  PutCameraRequest,
  PatchCameraRequest,
  PagedResult,
} from "@features/cameras/types/camera.types";

interface BackendResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export const cameraApi = {
  getAll: async (page = 1, limit = 50): Promise<PagedResult<CameraDevice>> => {
    const response = await httpClient.get<
      BackendResponse<PagedResult<CameraDevice>>
    >("/camera", {
      params: { page, limit },
    });

    console.log("Camera ALL: ", response.data.data);
    return response.data.data;
  },

  getById: async (id: number): Promise<CameraDevice> => {
    const response = await httpClient.get<BackendResponse<CameraDevice>>(
      `/camera/${id}`,
    );
    return response.data.data;
  },

  create: async (data: CreateCameraRequest): Promise<CameraDevice> => {
    const response = await httpClient.post<BackendResponse<CameraDevice>>(
      "/camera",
      data,
    );
    return response.data.data;
  },

  updateByPut: async (id: number, data: PutCameraRequest): Promise<void> => {
    await httpClient.put(`/camera/${id}`, data);
  },

  updateByPatch: async (
    id: number,
    data: PatchCameraRequest,
  ): Promise<CameraDevice> => {
    const response = await httpClient.patch<BackendResponse<CameraDevice>>(
      `/camera/${id}`,
      data,
    );
    return response.data.data;
  },

  deleteById: async (id: number): Promise<void> => {
    await httpClient.delete(`/camera/${id}`);
  },
};
