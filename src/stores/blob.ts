import { create } from "zustand";

interface BlobStore {
    blob: Blob | null;
    setBlob: (blob: Blob | null) => void;
}

const useBlobStore = create<BlobStore>((set) => ({
    blob: null,
    setBlob(blob) {
        set({ blob });
    },
}));

export default useBlobStore;
