export const darkPalette = {
  // Màu chính: Deep Charcoal & Slate (Dark Theme Main)
  primary: {
    50: "#f1f0ee",
    100: "#e3e1dd",
    200: "#c7c3bb",
    300: "#aaa399",
    400: "#918777",
    500: "#786d5e",
    600: "#605547",
    700: "#483d30",
    800: "#302519",
    900: "#1a1410",
    main: "#0f0d0a",
    light: "#302519",
    dark: "#0a0805",
  },

  // Màu phụ: Warm Coral & Terracotta (Highlights)
  secondary: {
    50: "#fef5f3",
    100: "#fce5e1",
    200: "#f8cfc6",
    300: "#f4aca4",
    400: "#f08577",
    500: "#e85c4a",
    600: "#d63f2e",
    700: "#b42e23",
    800: "#8b221a",
    900: "#5c1612",
    main: "#e85c4a", // #00B3A4
    light: "#f08577",
    dark: "#b42e23",
  },

  // Màu nhấn: Warm Amber & Gold (CTAs, Highlights)
  accent: {
    50: "#fff8f0",
    100: "#ffebd6",
    200: "#ffdbad",
    300: "#ffcc7f",
    400: "#ffb84d",
    500: "#ffa500",
    600: "#ff9200",
    700: "#e67e00",
    800: "#cc6600",
    900: "#994d00",
    main: "#ffa500",
    light: "#ffb84d",
    dark: "#e67e00",
  },

  // Màu thứ 3: Soft sage green
  tertiary: {
    50: "#f0f4f1",
    100: "#dce5e0",
    200: "#b8cfc1",
    300: "#93baa2",
    400: "#6ea483",
    500: "#5a9370",
    600: "#4a7b5a",
    700: "#3a6345",
    800: "#2a4b31",
    900: "#1d331f",
    main: "#5a9370",
  },

  // Màu trung tính: Grayscale cho dark theme
  neutral: {
    50: "#fafaf9",
    100: "#f5f5f4",
    150: "#e8e7e5",
    200: "#d7d6d2",
    300: "#c5c3be",
    400: "#a8a5a0",
    500: "#8b8882",
    600: "#6f6d67",
    700: "#53524e",
    800: "#3a3935",
    900: "#242320",
    950: "#0f0d0a",
  },

  // Màu ngữ nghĩa
  semantic: {
    success: "#6ba82f", // Muted green
    warning: "#d97706", // Warm amber
    error: "#e85c4a", // Coral
    info: "#64748b", // Slate
  },

  background: {
    default: "#0f0d0a", // Deep charcoal
    surface: "#1a1814", // Slightly lighter
    elevated: "#2a2620", // For cards/modals
  },

  divider: "#3a3935",

  // Màu mở rộng cho giao diện camera
  camera: {
    recording: "#e85c4a", // Red coral cho recording
    idle: "#64748b", // Slate gray cho idle
    active: "#ffa500", // Amber cho active/focus
  },
};

export const lightPalette = {
  // Màu chính
  primary: {
    50: "#f8f6f4",
    100: "#f0ede8",
    200: "#e3ddd4",
    300: "#d5ccbe",
    400: "#c7bba8",
    500: "#baaa92",
    600: "#a4957d",
    700: "#8e8069",
    800: "#786855",
    900: "#625241",
    main: "#8e8069",
    light: "#a4957d",
    dark: "#627241",
  },

  // Màu phụ
  secondary: {
    50: "#fef5f3",
    100: "#fce5e1",
    200: "#f8cfc6",
    300: "#f4aca4",
    400: "#f08577",
    500: "#e85c4a",
    600: "#d63f2e",
    700: "#b42e23",
    800: "#8b221a",
    900: "#5c1612",
    main: "#d63f2e",
    light: "#f08577",
    dark: "#8b221a",
  },

  // Màu nhấn: như amber
  accent: {
    50: "#fff8f0",
    100: "#ffebd6",
    200: "#ffdbad",
    300: "#ffcc7f",
    400: "#ffb84d",
    500: "#ffa500",
    600: "#ff9200",
    700: "#e67e00",
    800: "#cc6600",
    900: "#994d00",
    main: "#ff9200",
    light: "#ffb84d",
    dark: "#cc6600",
  },

  // Màu thứ 3: Deeper sage
  tertiary: {
    50: "#f0f4f1",
    100: "#dce5e0",
    200: "#b8cfc1",
    300: "#93baa2",
    400: "#6ea483",
    500: "#5a9370",
    600: "#4a7b5a",
    700: "#3a6345",
    800: "#2a4b31",
    900: "#1d331f",
    main: "#4a7b5a",
  },

  // Màu trung tính: Đảo ngược cho giao diện sáng
  neutral: {
    50: "#0f0d0a",
    100: "#242320",
    150: "#3a3935",
    200: "#53524e",
    300: "#6f6d67",
    400: "#8b8882",
    500: "#a8a5a0",
    600: "#c5c3be",
    700: "#d7d6d2",
    800: "#e8e7e5",
    900: "#f5f5f4",
    950: "#fafaf9",
  },

  // Màu ngữ nghĩa
  semantic: {
    success: "#6ba82f",
    warning: "#ff9200",
    error: "#d63f2e",
    info: "#8e8069",
  },

  background: {
    default: "#fafaf9", // Off-white
    surface: "#ffffff", // Pure white
    elevated: "#f5f5f4", // Slightly gray
  },

  divider: "#d7d6d2",

  camera: {
    recording: "#d63f2e",
    idle: "#8e8069",
    active: "#ff9200",
  },
};

// Root palette export (dark theme as primary)
export const palette = darkPalette;

// Màu chữ cho dark theme
export const darkTextColor = {
  primary: darkPalette.neutral[50], // Off-white
  secondary: darkPalette.neutral[400], // Medium gray
  tertiary: darkPalette.neutral[500], // Gray
  disabled: darkPalette.neutral[600], // Darker gray
  inverse: "#0f0d0a", // Dark text on light
};

// Màu chữ cho light theme
export const lightTextColor = {
  primary: lightPalette.neutral[50], // Deep charcoal (inverted)
  secondary: lightPalette.neutral[400], // Medium gray
  tertiary: lightPalette.neutral[500], // Gray
  disabled: lightPalette.neutral[600], // Lighter gray
  inverse: "#fafaf9", // Light text on dark
};

export const textColor = darkTextColor;
