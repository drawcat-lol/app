"use client";

import suapbase from "@/utils/supabase";
import { useEffect } from "react";

export default function Page() {
    useEffect(() => {
        async function redirect() {
            const redirectTo = `${window.location.origin}/auth/callback/discord`;

            await suapbase.auth.signInWithOAuth({
                provider: "discord",
                options: { redirectTo },
            });
        }

        redirect();
    }, []);

    return (
        <div className="flex justify-center items-center h-screen">
            <span className="">signing you in...</span>
        </div>
    );
}
