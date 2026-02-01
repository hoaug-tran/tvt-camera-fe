import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppThemeProvider from "./app/providers/ThemeProvider";

import "./themes/globals.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppThemeProvider>
  </StrictMode>,
);
