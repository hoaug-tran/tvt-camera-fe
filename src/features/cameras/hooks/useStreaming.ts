import { useState, useEffect, useCallback } from "react";
import { streamingApi } from "@features/cameras/services/streaming.api";
import { useCamerasStore } from "@features/cameras/stores/cameras.store";

interface StreamingState {
  hlsUrl: string | null;
  isLoading: boolean;
  error: string | null;
  isStreaming: boolean;
}

export const useStreaming = (
  cameraId: number | null,
  isSubStream: boolean = false,
) => {
  const [state, setState] = useState<StreamingState>({
    hlsUrl: null,
    isLoading: false,
    error: null,
    isStreaming: false,
  });

  const { updateStreamingState } = useCamerasStore();

  useEffect(() => {
    let ignore = false;

    const ensureStreamRunning = async () => {
      if (cameraId === null) return;

      setState((prev) => ({
        ...prev,
        isLoading: !prev.hlsUrl || !prev.isStreaming,
        error: null,
      }));

      try {
        const status = await streamingApi.getStreamStatus(
          cameraId,
          isSubStream,
        );

        if (ignore) return;

        if (status.isStreaming) {
          const newState: StreamingState = {
            isStreaming: true,
            hlsUrl: streamingApi.buildWebrtcUrl(cameraId, isSubStream),
            isLoading: false,
            error: null,
          };
          setState(newState);
          updateStreamingState(cameraId, newState);
        } else {
          await streamingApi.startStream(cameraId, isSubStream);

          if (ignore) return;

          const newState: StreamingState = {
            hlsUrl: streamingApi.buildWebrtcUrl(cameraId, isSubStream),
            isLoading: false,
            error: null,
            isStreaming: true,
          };
          setState(newState);
          updateStreamingState(cameraId, newState);
        }
      } catch (err) {
        if (ignore) return;

        const errorMessage =
          err instanceof Error ? err.message : "Failed to start stream";
        console.error(`[STREAMING ERROR] Camera ${cameraId}:`, err);

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
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        ensureStreamRunning();
      }
      // Kệ
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    ensureStreamRunning();

    return () => {
      ignore = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [cameraId, isSubStream, updateStreamingState]);

  const startStream = useCallback(async () => {
    if (cameraId === null) return;

    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      await streamingApi.startStream(cameraId, isSubStream);

      const newState: StreamingState = {
        hlsUrl: streamingApi.buildWebrtcUrl(cameraId, isSubStream),
        isLoading: false,
        error: null,
        isStreaming: true,
      };
      setState(newState);
      updateStreamingState(cameraId, newState);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to start stream";
      console.error(`[STREAMING ERROR] Camera ${cameraId}:`, err);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      updateStreamingState(cameraId, { isLoading: false, error: errorMessage });
    }
  }, [cameraId, isSubStream, updateStreamingState]);

  const stopStream = useCallback(async () => {
    if (cameraId === null) return;

    try {
      await streamingApi.stopStream(cameraId, isSubStream);
      const newState: StreamingState = {
        hlsUrl: null,
        isLoading: false,
        error: null,
        isStreaming: false,
      };
      setState(newState);
      updateStreamingState(cameraId, newState);
    } catch (err) {
      console.error(`[STREAMING STOP ERROR] Camera ${cameraId}:`, err);
    }
  }, [cameraId, isSubStream, updateStreamingState]);

  return {
    ...state,
    startStream,
    stopStream,
  };
};
