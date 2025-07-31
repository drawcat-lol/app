"use client";

import { useTheme } from "next-themes";
import { Toaster } from "./ui/sonner";

type Theme = "light" | "dark" | "system";

export default function TheToaster() {
    const { theme } = useTheme();

    return <Toaster position="top-center" theme={theme as Theme} />;
}
