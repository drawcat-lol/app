import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createClient } from "@supabase/supabase-js";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const suapbase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function formatDate(iso: string): string {
    const date = new Date(iso);
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return `Today at ${date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
        })}`;
    } else if (diffDays === 1) {
        return `Yesterday at ${date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
        })}`;
    } else {
        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    }
}

export function removeHashZero(name: string) {
    const result = name.endsWith("#0") ? name.slice(0, -2) : name;
    return result;
}
