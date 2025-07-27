"use client";

import { suapbase } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import type { Provider } from "@supabase/supabase-js";

export default function Page() {
    const params = useParams();
    const provider = params.provider as Provider;

    useEffect(() => {
        const valid: Provider[] = ["discord", "slack_oidc", "github"];
        if (!valid.includes(provider)) return;

        suapbase.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    }, [provider]);

    return null;
}
