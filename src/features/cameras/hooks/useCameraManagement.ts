import { useState, useCallback } from "react";
import { cameraApi } from "@features/cameras/services/camera.api";
import type {
  CameraDevice,
  CreateCameraRequest,
  PatchCameraRequest,
} from "@features/cameras/types/camera.types";
import { logError } from "@utils/errorHandler";

export const useCameraManagement = () => {
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCameras = useCallback(async (targetPage = 1) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cameraApi.getAll(targetPage, 10);
      setCameras(result.items);
      setTotalPages(result.totalPages);
      setPage(targetPage);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Lỗi tải danh sách camera";
      setError(message);
      logError("useCameraManagement.fetchCameras", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCamera = useCallback(
    async (data: CreateCameraRequest): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await cameraApi.create(data);
        await fetchCameras(page);
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Lỗi tạo camera";
        setError(message);
        logError("useCameraManagement.createCamera", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchCameras, page],
  );

  const patchCamera = useCallback(
    async (id: number, data: PatchCameraRequest): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await cameraApi.updateByPatch(id, data);
        await fetchCameras(page);
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Lỗi cập nhật camera";
        setError(message);
        logError("useCameraManagement.patchCamera", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchCameras, page],
  );

  const deleteCamera = useCallback(
    async (id: number): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await cameraApi.deleteById(id);
        await fetchCameras(page);
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Lỗi xóa camera";
        setError(message);
        logError("useCameraManagement.deleteCamera", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchCameras, page],
  );

  return {
    cameras,
    loading,
    error,
    page,
    totalPages,
    fetchCameras,
    createCamera,
    patchCamera,
    deleteCamera,
  };
};
