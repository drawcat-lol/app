import { Cat } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar() {
    return (
        <div className="fixed top-0 left-0 p-2 w-full">
            <div className="mx-auto max-w-xl border bg-orange-100 p-4 px-6 shadow-2xl w-full">
                <span className="font-display font-bold flex items-center gap-1">
                    <Cat size={20} fill="white" strokeWidth={1.5} />
                    drawcat.lol
                </span>
            </div>
        </div>
    );
}
