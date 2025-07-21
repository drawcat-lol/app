"use client";

import { suapbase } from "@/lib/utils";
import useUserStore from "@/stores/user";
import { PropsWithChildren, useEffect } from "react";

export default function UserProvider({ children }: PropsWithChildren) {
    const { setUser } = useUserStore();

    useEffect(() => {
        (async () => {
            const { data } = await suapbase.auth.getUser();
            setUser(data.user);
        })();
    }, []);

    return <>{children}</>;
}
