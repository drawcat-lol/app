import { User } from "@supabase/supabase-js";
import { create } from "zustand";

interface UserStore {
    user: User | null;
    setUser: (user: User | null) => void;
}

const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser(user) {
        set({ user });
    },
}));

export default useUserStore;
