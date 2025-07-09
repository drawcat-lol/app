import { Cat } from "lucide-react";

export default function Navbar() {
    return (
        <div className="w-full px-10 py-6 bg-orange-100 flex justify-between items-center border-b">
            <span className="text-xl font-bold font-display flex gap-2 items-center">
                <Cat />
                drawcat.lol
            </span>

            <div className="hidden md:block">
                <div className="flex gap-8">
                    <span className="font-semibold">home</span>
                    <span className="font-semibold">explore</span>
                    <span className="font-semibold">account</span>
                </div>
            </div>
        </div>
    );
}
