import { create } from "zustand";

interface ShouldDraft {
    shouldDraft: boolean;
    setShouldDraft: (bool: boolean) => void;
}

const useShouldDraftStore = create<ShouldDraft>((set) => ({
    shouldDraft: false,
    setShouldDraft(bool) {
        set({ shouldDraft: bool });
    },
}));

export default useShouldDraftStore;
