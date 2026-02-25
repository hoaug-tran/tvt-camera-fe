export interface CameraDevice {
  udCameraDeviceID: number;
  udCameraDeviceIdDauGhi: number | null;
  udCameraDeviceIdChanel: number | null;
  udCameraDeviceUsername: string | null;
  udCameraDeviceConnectionStatus: number | null;
  udCameraDeviceDateDisconnected: string | null;
  udCameraDeviceDateConnected: string | null;
  htUserCreate: number | null;
  udCameraDeviceDateCreate: string | null;
  htUserEditor: number | null;
  udCameraDeviceDateEditor: string | null;
  udCameraDeviceHienThi: boolean | null;
  udCameraDeviceSuDung: string | null;
}

export interface CreateCameraRequest {
  udCameraDeviceIdDauGhi?: number;
  udCameraDeviceIdChanel?: number;
  udCameraDeviceIpAdress?: string;
  udCameraDevicePort?: number;
  udCameraDeviceUsername?: string;
  udCameraDevicePassword?: string;
  udCameraDeviceConnectionStatus?: number;
  udCameraDeviceDateDisconnected?: string;
  udCameraDeviceDateConnected?: string;
  htUserCreate?: number;
  udCameraDeviceDateCreate?: string;
  htUserEditor?: number;
  udCameraDeviceDateEditor?: string;
  udCameraDeviceHienThi?: boolean;
  udCameraDeviceSuDung?: string;
}

export interface PutCameraRequest {
  udCameraDeviceIdDauGhi: number;
  udCameraDeviceIdChanel: number;
  udCameraDeviceIpAdress: string;
  udCameraDevicePort: number;
  udCameraDeviceUsername: string;
  udCameraDevicePassword: string;
  udCameraDeviceConnectionStatus: number;
  udCameraDeviceDateDisconnected: string;
  udCameraDeviceDateConnected: string;
  htUserCreate: number;
  udCameraDeviceDateCreate: string;
  htUserEditor: number;
  udCameraDeviceDateEditor: string;
  udCameraDeviceHienThi: boolean;
  udCameraDeviceSuDung: string;
}

export interface PatchCameraRequest {
  udCameraDeviceIdDauGhi?: number;
  udCameraDeviceIdChanel?: number;
  udCameraDeviceUsername?: string;
  udCameraDeviceDateEditor?: string;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  isNext: boolean;
  isPrevious: boolean;
}

export interface StreamStartResponse {
  cameraId: number;
  hlsUrl: string;
}

export interface StreamStatusResponse {
  cameraId: number;
  isStreaming: boolean;
}

export interface StreamHlsUrlResponse {
  cameraId: number;
  hlsUrl: string;
}

export interface StreamingState {
  hlsUrl: string | null;
  isLoading: boolean;
  error: string | null;
  isStreaming: boolean;
}
