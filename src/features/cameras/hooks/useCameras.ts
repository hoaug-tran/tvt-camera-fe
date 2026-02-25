import { useEffect, useState } from "react";
import { cameraApi } from "@features/cameras/services/camera.api";
import type {
  CameraDevice,
  PagedResult,
} from "@features/cameras/types/camera.types";
import { logError } from "@utils/errorHandler";

export const useCameras = (page = 1, limit = 50) => {
  const [pagedResult, setPagedResult] =
    useState<PagedResult<CameraDevice> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        setLoading(true);
        const result = await cameraApi.getAll(page, limit);
        setPagedResult(result);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch cameras";
        setError(errorMessage);
        logError("useCameras", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCameras();
  }, [page, limit]);

  return {
    cameras: pagedResult?.items ?? [],
    pagedResult,
    loading,
    error,
  };
};
