// reload the explore component

import { create } from "zustand";

interface ShouldReload {
    shouldReload: boolean;
    setShouldReload: (bool: boolean) => void;
}

const useShouldReloadStore = create<ShouldReload>((set) => ({
    shouldReload: false,
    setShouldReload(bool) {
        set({ shouldReload: bool });
    },
}));

export default useShouldReloadStore;
