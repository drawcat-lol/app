import { create } from "zustand";

interface FullscreenStore {
    fullscreen: boolean;
    setFullscreen: (fullscreen: boolean) => void;
}

const useFullscreenStore = create<FullscreenStore>((set) => ({
    fullscreen: false,
    setFullscreen(fullscreen) {
        set({ fullscreen });
    },
}));

export default useFullscreenStore;