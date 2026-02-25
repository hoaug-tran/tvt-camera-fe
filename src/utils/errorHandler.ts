/**
 * Shared error handling utilities for API calls
 */

export interface ApiError {
  message: string;
  statusCode?: number;
  details?: unknown;
}

/**
 * Parse API error response and extract meaningful message
 */
export const parseApiError = (
  status: number,
  responseData?: unknown,
  fallbackMessage = "An error occurred",
): string => {
  // Check if response is JSON with error message
  if (typeof responseData === "object" && responseData !== null) {
    const data = responseData as Record<string, unknown>;
    if (typeof data.message === "string") {
      return data.message;
    }
    if (data.data && typeof data.data === "object") {
      const nestedData = data.data as Record<string, unknown>;
      if (typeof nestedData.message === "string") {
        return nestedData.message;
      }
    }
  }

  // Fallback to status-based messages
  switch (status) {
    case 400:
      return "Dữ liệu không hợp lệ";
    case 401:
      return "Tên đăng nhập hoặc mật khẩu không chính xác";
    case 403:
      return "Bạn không có quyền truy cập";
    case 404:
      return "Tài nguyên không tìm thấy";
    case 500:
      return "Lỗi máy chủ, vui lòng thử lại sau";
    case 502:
    case 503:
      return "Máy chủ tạm thời không khả dụng";
    default:
      return fallbackMessage;
  }
};

/**
 * Handle API response errors consistently
 */
export const handleApiError = async (response: Response): Promise<never> => {
  let errorData: unknown;

  try {
    errorData = await response.json();
  } catch {
    errorData = undefined;
  }

  const message = parseApiError(response.status, errorData);
  const error = new Error(message);
  (error as ApiError & Error).statusCode = response.status;
  (error as ApiError & Error).details = errorData;

  throw error;
};

/**
 * Log error with context
 */
export const logError = (
  context: string,
  error: unknown,
  additionalInfo?: Record<string, unknown>,
): void => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(`[${context}] ${errorMessage}`, {
    error,
    ...additionalInfo,
  });
};
