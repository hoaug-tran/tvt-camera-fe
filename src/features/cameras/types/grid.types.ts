export type LayoutType = 1 | 4 | 9 | 16;

export interface GridContextType {
  layout: LayoutType;
  setLayout: (layout: LayoutType) => void;
  slots: (number | null)[];
  slotScales: number[];
  selectedSlot: number | null;
  setSelectedSlot: (index: number | null) => void;
  setCameraInSlot: (index: number, cameraId: number | null) => void;
  setSlotScale: (index: number, scale: number) => void;
  removeCameraById: (cameraId: number) => void;
  swapSlots: (index1: number, index2: number) => void;
  clearAllSlots: () => void;
}
