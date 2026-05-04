import React, { useState, type ReactNode } from "react";

import { GridContext } from "./grid-context";
import type { LayoutType } from "@/features/cameras/types/grid.types";

export const GridProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [layout, setLayout] = useState<LayoutType>(1);
  const [slots, setSlots] = useState<(number | null)[]>(() =>
    Array(16).fill(null),
  );
  const [slotScales, setSlotScales] = useState<number[]>(() => Array(16).fill(1));
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const setCameraInSlot = (index: number, cameraId: number | null) => {
    setSlots((prev) => {
      const newSlots = [...prev];
      newSlots[index] = cameraId;
      return newSlots;
    });
    setSlotScales((prevScales) => {
      const newScales = [...prevScales];
      newScales[index] = 1;
      return newScales;
    });

    if (cameraId !== null) {
      setSelectedSlot(index);
    }
  };

  const setSlotScale = (index: number, scale: number) => {
    setSlotScales((prev) => {
      const newScales = [...prev];
      newScales[index] = Math.min(Math.max(scale, 1), 5);
      return newScales;
    });
  };

  const removeCameraById = (cameraId: number) => {
    setSlots((prev) => {
      const index = prev.findIndex((id) => id === cameraId);
      if (index !== -1) {
        setSlotScales((prevScales) => {
          const newScales = [...prevScales];
          newScales[index] = 1;
          return newScales;
        });
      }
      return prev.map((id) => (id === cameraId ? null : id));
    });
  };

  const swapSlots = (index1: number, index2: number) => {
    setSlots((prev) => {
      const newSlots = [...prev];
      const temp = newSlots[index1];
      newSlots[index1] = newSlots[index2];
      newSlots[index2] = temp;
      return newSlots;
    });

    setSlotScales((prev) => {
      const newScales = [...prev];
      const tempScale = newScales[index1];
      newScales[index1] = newScales[index2];
      newScales[index2] = tempScale;
      return newScales;
    });

    if (selectedSlot === index1) setSelectedSlot(index2);
    else if (selectedSlot === index2) setSelectedSlot(index1);
  };

  const clearAllSlots = () => {
    setSlots(Array(16).fill(null));
    setSlotScales(Array(16).fill(1));
    setSelectedSlot(null);
  };

  return (
    <GridContext.Provider
      value={{
        layout,
        setLayout,
        slots,
        slotScales,
        selectedSlot,
        setSelectedSlot,
        setCameraInSlot,
        setSlotScale,
        removeCameraById,
        swapSlots,
        clearAllSlots,
      }}
    >
      {children}
    </GridContext.Provider>
  );
};
