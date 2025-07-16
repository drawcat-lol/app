import supabase from "@/utils/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (code) {
        await supabase.auth.exchangeCodeForSession(code);
    }

    return NextResponse.redirect(new URL("/", request.url));
}
