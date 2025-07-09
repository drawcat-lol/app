"use client";

import suapbase from "@/utils/supabase";
import { useEffect } from "react";

export default function Page() {
    const redirectTo = `${window.location.origin}/auth/callback/github`;

    useEffect(() => {
        async function redirect() {
            await suapbase.auth.signInWithOAuth({
                provider: "github",
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
