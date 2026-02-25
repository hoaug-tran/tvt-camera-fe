import { createContext, useContext } from "react";

export interface ThemeContextType {
  mode: "light" | "dark";
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

export const useThemeMode = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within AppThemeProvider");
  }
  return context;
};
