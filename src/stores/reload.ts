import { create } from "zustand";

type ExploreStore = {
    shouldReloadExplore: boolean;
    setShouldReloadExplore: (value: boolean) => void;
};

const useReloadExploreStore = create<ExploreStore>((set) => ({
    shouldReloadExplore: false,
    setShouldReloadExplore: (value) => set({ shouldReloadExplore: value }),
}));

export default useReloadExploreStore;