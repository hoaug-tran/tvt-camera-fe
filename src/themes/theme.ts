import { createTheme } from "@mui/material/styles";
import { palette, textColor } from "./palette";

declare module "@mui/material/styles" {
  interface TypeBackground {
    surface: string;
  }
}

export const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontSize: "1.875rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.5px",
    },
    h5: {
      fontSize: "1.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.3px",
    },
    h6: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    body1: {
      fontSize: "0.9375rem",
      fontWeight: 400,
      lineHeight: 1.5,
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
  },
  palette: {
    primary: {
      main: palette.primary.main,
      light: palette.primary[200],
      dark: palette.primary[900],
      contrastText: "#ffffff",
    },
    error: {
      main: palette.semantic.error,
    },
    warning: {
      main: palette.semantic.warning,
    },
    success: {
      main: palette.semantic.success,
    },
    info: {
      main: palette.semantic.info,
    },
    background: {
      default: palette.background.default,
      paper: palette.background.surface,
    },
    text: {
      primary: textColor.primary,
      secondary: textColor.secondary,
      disabled: textColor.disabled,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: "6px",
        },
        contained: {
          "&:hover": {
            boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: palette.neutral[50],
            borderRadius: "6px",
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
  },
});
