"use client";

import { suapbase } from "@/lib/utils";
import useUserStore from "@/stores/user";
import { PropsWithChildren, useEffect } from "react";

export default function UserProvider({ children }: PropsWithChildren) {
    const { setUser } = useUserStore();

    useEffect(() => {
        (async () => {
            const { data } = await suapbase.auth.getUser();
            
            if (data.user) {
                setUser(data.user);

                await suapbase.from("profiles").upsert({
                    id: data.user.id,
                    raw_user_meta_data: data.user.user_metadata,
                });
            }
        })();
    }, []);

    return <>{children}</>;
}
