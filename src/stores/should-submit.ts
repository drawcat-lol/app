import { create } from "zustand";

interface ShouldSubmit {
    shouldSubmit: boolean;
    setShouldSubmit: (bool: boolean) => void;
}

const useShouldSubmitStore = create<ShouldSubmit>((set) => ({
    shouldSubmit: false,
    setShouldSubmit(bool) {
        set({ shouldSubmit: bool });
    },
}));

export default useShouldSubmitStore;
