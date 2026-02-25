import { createTheme } from "@mui/material/styles";
import {
  lightPalette,
  darkPalette,
  lightTextColor,
  darkTextColor,
} from "./palette";

declare module "@mui/material/styles" {
  interface TypeBackground {
    surface: string;
    elevated: string;
  }
}

const commonSettings = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-1px",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.8px",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.6px",
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.5px",
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: "-0.3px",
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: "0px",
    },
    body1: {
      fontSize: "0.95rem",
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 400,
      lineHeight: 1.4,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      fontSize: "0.95rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: "8px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          fontSize: "0.95rem",
          padding: "10px 20px",
        },
        containedPrimary: {
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
          },
          "&:active": {
            transform: "translateY(0px)",
          },
        },
        outlined: {
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          transition: "all 0.2s ease",
          fontSize: "0.95rem",
          "& fieldset": {
            borderWidth: 1.5,
          },
          "&:hover fieldset": {
            borderWidth: 2,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          backgroundImage: "none",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          transition: "all 0.2s ease",
          "&:hover": {
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: "6px",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: "light",
    primary: {
      main: lightPalette.primary.main,
      light: lightPalette.primary.light,
      dark: lightPalette.primary.dark,
      contrastText: "#fafaf9",
    },
    secondary: {
      main: lightPalette.secondary.main,
      light: lightPalette.secondary.light,
      dark: lightPalette.secondary.dark,
      contrastText: "#fafaf9",
    },
    error: {
      main: lightPalette.semantic.error,
    },
    warning: {
      main: lightPalette.semantic.warning,
    },
    success: {
      main: lightPalette.semantic.success,
    },
    info: {
      main: lightPalette.semantic.info,
    },
    background: {
      default: lightPalette.background.default,
      paper: lightPalette.background.surface,
    },
    text: {
      primary: lightTextColor.primary,
      secondary: lightTextColor.secondary,
      disabled: lightTextColor.disabled,
    },
    divider: lightPalette.divider,
  },
});

export const darkTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: "dark",
    primary: {
      main: darkPalette.primary.main,
      light: darkPalette.primary.light,
      dark: darkPalette.primary.dark,
      contrastText: "#fafaf9",
    },
    secondary: {
      main: darkPalette.secondary.main,
      light: darkPalette.secondary.light,
      dark: darkPalette.secondary.dark,
      contrastText: "#fafaf9",
    },
    error: {
      main: darkPalette.semantic.error,
    },
    warning: {
      main: darkPalette.semantic.warning,
    },
    success: {
      main: darkPalette.semantic.success,
    },
    info: {
      main: darkPalette.semantic.info,
    },
    background: {
      default: darkPalette.background.default,
      paper: darkPalette.background.surface,
    },
    text: {
      primary: darkTextColor.primary,
      secondary: darkTextColor.secondary,
      disabled: darkTextColor.disabled,
    },
    divider: darkPalette.divider,
  },
});
