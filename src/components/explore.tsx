import Image from "next/image";
import { Button } from "./ui/button";
import { Heart, Share2 } from "lucide-react";

export default function Explore() {
    return (
        <div className="max-w-6xl mx-auto border-t py-20 px-4 text-center">
            <div className="flex flex-col">
                <span className="font-display font-bold text-4xl">
                    explore cats
                </span>
                <span className="mt-8 text-lg text-balance opacity-75">
                    see what others have drawn!
                    <br />
                    you can also like and comment.
                </span>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                {[1, 1, 1, 1, 1, 1].map((item, index) => (
                    <div
                        className="rounded-2xl shadow-2xl border w-full flex flex-col text-start overflow-hidden group"
                        key={index}
                    >
                        <div className="overflow-hidden border-b">
                            <Image
                                className="w-full aspect-square group-hover:scale-105 duration-175"
                                src={"/cat_drawing.png"}
                                width={256}
                                height={256}
                                alt="cat drawing"
                            />
                        </div>
                        <div className="p-4 flex flex-col gap-2">
                            <span className="font-bold font-display text-2xl">
                                some cat
                            </span>
                            <div className="flex justify-between items-end">
                                <div className="flex gap-2">
                                    <Button variant={"outline"} size={"icon"}>
                                        <Heart />
                                    </Button>
                                    <Button variant={"outline"} size={"icon"}>
                                        <Share2 />
                                    </Button>
                                </div>

                                <span className="text-xs font-semibold opacity-50">
                                    2 days ago
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
