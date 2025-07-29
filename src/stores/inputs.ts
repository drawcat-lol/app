import { create } from "zustand";

type InputStore = {
    inputs: { [key: string]: string };
    setInput: (key: string, value: string) => void;
    resetInputs: () => void;
};

const useInputStore = create<InputStore>((set) => ({
    inputs: {},
    setInput: (key, value) =>
        set((state) => ({
            inputs: { ...state.inputs, [key]: value },
        })),
    resetInputs: () => set({ inputs: {} }),
}));

export default useInputStore;