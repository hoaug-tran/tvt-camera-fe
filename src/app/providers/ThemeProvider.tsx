import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@themes/theme";
import { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

export const AppThemeProvider = ({ children }: ThemeProviderProps) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default AppThemeProvider;
