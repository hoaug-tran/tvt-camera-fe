import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppThemeProvider from "./app/providers/ThemeProvider";
import { GridProvider } from "./features/cameras/context/GridProvider";

import "./themes/globals.css";
import App from "./App.tsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <BrowserRouter>
          <GridProvider>
            <App />
          </GridProvider>
        </BrowserRouter>
      </AppThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
