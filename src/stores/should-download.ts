import { create } from "zustand";

interface ShouldDownload {
    shouldDownload: boolean;
    setShouldDownload: (bool: boolean) => void;
}

const useShouldDownloadStore = create<ShouldDownload>((set) => ({
    shouldDownload: false,
    setShouldDownload(bool) {
        set({ shouldDownload: bool });
    },
}));

export default useShouldDownloadStore;
