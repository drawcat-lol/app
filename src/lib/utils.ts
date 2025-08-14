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

// removes #0 from usernames (discord)
// export function removeHashZero(name: string) {
//     const result = name.endsWith("#0") ? name.slice(0, -2) : name;
//     return result;
// }

// adds a white background to drawings
export async function whiteBbg(pngBlob: Blob): Promise<Blob> {
    const img = new Image();
    img.src = URL.createObjectURL(pngBlob);

    await new Promise<void>((resolve) => {
        img.onload = () => resolve();
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    return await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), "image/png");
    });
}

export function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = filename;

    document.body.appendChild(a);

    a.click();
    a.remove();

    URL.revokeObjectURL(url);
}

export async function uploadToBucket(
    blob: Blob,
    filename: string,
    bucket: string
) {
    const { data, error } = await suapbase.storage
        .from(bucket)
        .upload(filename, blob, { upsert: true });

    return { data, error };
}
