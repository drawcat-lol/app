import { create } from "zustand";

interface StartedDrawing {
    startedDrawing: boolean;
    setStartedDrawing: (bool: boolean) => void;
}

const useStartedDrawingStore = create<StartedDrawing>((set) => ({
    startedDrawing: false,
    setStartedDrawing(bool) {
        set({ startedDrawing: bool });
    },
}));

export default useStartedDrawingStore;
