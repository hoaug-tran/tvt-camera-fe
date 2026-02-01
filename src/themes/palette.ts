export const palette = {
  primary: {
    50: "#f0f4ff",
    100: "#e0e9ff",
    200: "#c7d7ff",
    300: "#a4befd",
    400: "#7c9ff9",
    500: "#5680f7",
    600: "#3d5deb",
    700: "#2d47d1",
    800: "#2438a8",
    900: "#1f2e7f",
    main: "#1976d2",
  },
  neutral: {
    50: "#f9fafb",
    100: "#f3f4f6",
    150: "#eeeff5",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
  semantic: {
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  },
  background: {
    default: "#f8f9fa",
    surface: "#ffffff",
  },
};

export const textColor = {
  primary: palette.neutral[900],
  secondary: palette.neutral[600],
  tertiary: palette.neutral[500],
  disabled: palette.neutral[400],
  inverse: "#ffffff",
};
