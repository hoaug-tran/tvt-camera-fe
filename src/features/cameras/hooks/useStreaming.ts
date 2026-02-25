import { useState, useCallback, useEffect } from "react";
import { streamingApi } from "@features/cameras/services/streaming.api";
import useCamerasStore from "@features/cameras/stores/cameras.store";
import type { StreamingState } from "@features/cameras/types/camera.types";
import { logError } from "@utils/errorHandler";

const useStreaming = (cameraId: number | null) => {
  const [state, setState] = useState<StreamingState>({
    hlsUrl: null,
    isLoading: false,
    error: null,
    isStreaming: false,
  });

  const { updateStreamingState } = useCamerasStore();

  useEffect(() => {
    if (cameraId === null) return;

    let isMounted = true;

    const ensureStreamRunning = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true }));

        const status = await streamingApi.getStreamStatus(cameraId);

        if (status.isStreaming) {
          if (isMounted) {
            const newState: StreamingState = {
              isStreaming: true,
              hlsUrl: streamingApi.buildHlsUrl(cameraId),
              isLoading: false,
              error: null,
            };
            setState(newState);
            updateStreamingState(cameraId, newState);
          }
        } else {
          await streamingApi.startStream(cameraId);

          await new Promise((resolve) => setTimeout(resolve, 5000));

          if (isMounted) {
            const newState: StreamingState = {
              hlsUrl: streamingApi.buildHlsUrl(cameraId),
              isLoading: false,
              error: null,
              isStreaming: true,
            };
            setState(newState);
            updateStreamingState(cameraId, newState);
          }
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to start stream";
        logError("useStreaming.ensureStreamRunning", err, { cameraId });
        if (isMounted) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: errorMessage,
          }));
          updateStreamingState(cameraId, {
            isLoading: false,
            error: errorMessage,
          });
        }
      }
    };

    ensureStreamRunning();

    return () => {
      isMounted = false;
    };
  }, [cameraId, updateStreamingState]);

  const startStream = useCallback(async () => {
    if (cameraId === null) return;

    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      await streamingApi.startStream(cameraId);

      await new Promise((resolve) => setTimeout(resolve, 5000));

      const newState: StreamingState = {
        hlsUrl: streamingApi.buildHlsUrl(cameraId),
        isLoading: false,
        error: null,
        isStreaming: true,
      };
      setState(newState);
      updateStreamingState(cameraId, newState);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to start stream";
      logError("useStreaming.startStream", err, { cameraId });
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      updateStreamingState(cameraId, { isLoading: false, error: errorMessage });
    }
  }, [cameraId, updateStreamingState]);

  const stopStream = useCallback(async () => {
    if (cameraId === null) return;

    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      await streamingApi.stopStream(cameraId);
      const newState: StreamingState = {
        hlsUrl: null,
        isLoading: false,
        error: null,
        isStreaming: false,
      };
      setState(newState);
      updateStreamingState(cameraId, newState);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to stop stream";
      logError("useStreaming.stopStream", err, { cameraId });
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      updateStreamingState(cameraId, { isLoading: false, error: errorMessage });
    }
  }, [cameraId, updateStreamingState]);

  return {
    ...state,
    startStream,
    stopStream,
  };
};

export default useStreaming;
