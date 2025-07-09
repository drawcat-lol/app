import { Cat } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
    return (
        <div className="w-full px-10 py-6 bg-orange-100 flex justify-between items-center border-b">
            <span className="text-xl font-bold font-display flex gap-2 items-center">
                <Cat />
                drawcat.lol
            </span>

            <div className="hidden md:block">
                <div className="flex gap-8">
                    <Link href={"/canvas"} className="font-semibold">canvas</Link>
                    <Link href={"/explore"} className="font-semibold">explore</Link>
                    <Link href={"/account"} className="font-semibold">account</Link>
                </div>
            </div>
        </div>
    );
}
