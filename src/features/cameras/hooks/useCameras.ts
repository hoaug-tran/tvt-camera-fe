import { useQuery } from "@tanstack/react-query";
import { cameraApi } from "@features/cameras/services/camera.api";

export const useCameras = (page = 1, limit = 50) => {
  const { 
    data: pagedResult, 
    isLoading: loading, 
    error: queryError 
  } = useQuery({
    queryKey: ['cameras', page, limit],
    queryFn: () => cameraApi.getAll(page, limit),
  });

  return {
    cameras: pagedResult?.items ?? [],
    pagedResult,
    loading,
    error: queryError ? (queryError instanceof Error ? queryError.message : "Failed to fetch cameras") : null,
  };
};
