"use client";

import Navbar from "@/components/navbar";
import useUserStore from "@/stores/user";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
    const { user } = useUserStore();

    useEffect(() => {
        console.log(user?.email);
    }, [user]);

    return (
        <div className="">
            <Navbar />
        </div>
        // <div className="flex flex-col">
        //     <Link href={"/auth/provider/discord"}>sign in with discord</Link>
        //     <Link href={"/auth/provider/github"}>sign in with github</Link>
        // </div>
    );
}
