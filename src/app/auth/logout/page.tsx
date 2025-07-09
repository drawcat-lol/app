"use client";

import suapbase from "@/utils/supabase";
import { redirect, RedirectType } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
    useEffect(() => {
        async function yes() {
            await suapbase.auth.signOut();
            redirect("/", RedirectType.replace);
        }

        yes();
    }, []);

    return (
        <div className="flex justify-center items-center h-screen">
            <span className="">logging you out...</span>
        </div>
    );
}
