import { Cat } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar() {
    return (
        <div className="fixed w-full top-0 left-0 p-2">
            <div className="rounded-2xl border bg-orange-100 p-4 px-6 shadow-2xl">
                <span className="font-display font-bold flex items-center gap-1">
                    <Cat size={20} strokeWidth={1.5} />
                    drawcat.lol
                </span>
            </div>
        </div>
        // <div className="w-full px-8 py-4 bg-orange-100 flex justify-between items-center border-b border-b-black">
        //     <span className="text-lg font-bold font-display flex gap-2 items-center">
        //         <Cat />
        //         drawcat.lol
        //     </span>

        //     <div className="hidden md:block">
        //         <div className="flex">
        //             <Link href={"/canvas"} className="font-semibold">
        //                 <Button variant={"link"}>canvas</Button>
        //             </Link>
        //             <Link href={"/explore"} className="font-semibold">
        //                 <Button variant={"link"}>explore</Button>
        //             </Link>
        //             <Link href={"/account"} className="font-semibold">
        //                 <Button variant={"link"}>account</Button>
        //             </Link>
        //         </div>
        //     </div>
        // </div>
    );
}
