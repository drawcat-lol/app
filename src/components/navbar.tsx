import { Cat } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar() {
    return (
        <div className="w-full px-8 py-4 bg-orange-100 flex justify-between items-center border-b border-b-black">
            <span className="text-lg font-bold font-display flex gap-2 items-center">
                <Cat />
                drawcat.lol
            </span>

            <div className="hidden md:block">
                <div className="flex">
                    <Link href={"/canvas"} className="font-semibold">
                        <Button variant={"link"}>canvas</Button>
                    </Link>
                    <Link href={"/explore"} className="font-semibold">
                        <Button variant={"link"}>explore</Button>
                    </Link>
                    <Link href={"/account"} className="font-semibold">
                        <Button variant={"link"}>account</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
