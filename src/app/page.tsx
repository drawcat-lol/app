"use client";

import Navbar from "@/components/navbar";
import Hero from "@/components/sections/hero";
import useUserStore from "@/stores/user";
import { useEffect } from "react";

export default function Home() {
    const { user } = useUserStore();

    useEffect(() => {
        console.log(user?.email);
    }, [user]);

    return (
        <div>
            <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,rgb(255,140,55,0.5)_100%)]"></div>
            <Hero />
        </div>
    );
}
