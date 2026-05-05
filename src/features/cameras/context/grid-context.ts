import { createContext } from "react";

import type { GridContextType } from "@/features/cameras/types/grid.types";

export const GridContext = createContext<GridContextType | undefined>(
  undefined,
);
