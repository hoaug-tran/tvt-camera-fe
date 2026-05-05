import { use } from "react";

import { GridContext } from "@/features/cameras/context/grid-context";

export const useGrid = () => {
  const context = use(GridContext);
  if (!context) {
    throw new Error("useGrid must be used within a GridProvider");
  }
  return context;
};
