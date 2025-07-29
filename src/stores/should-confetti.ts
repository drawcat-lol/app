import { create } from "zustand";

type ConfettiStore = {
    shouldConfetti: boolean;
    setShouldConfetti: (value: boolean) => void;
};

const useConfettiStore = create<ConfettiStore>((set) => ({
    shouldConfetti: false,
    setShouldConfetti: (value) => set({ shouldConfetti: value }),
}));

export default useConfettiStore;