import Image from "next/image";
import { Button } from "./ui/button";
import { Heart, Share2 } from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import suapbase from "@/utils/supabase";
import { toast } from "sonner";
import { formatDate } from "@/utils/formatDate";

export default function Explore() {
    const [pics, setPics] = useState<any[]>([]);

    useEffect(() => {
        const yes = async () => {
            const { data, error } = await suapbase
                .from("list")
                .select("*")
                .limit(12);

            if (!error) {
                setPics(data);
            } else {
                toast.error("couldn't fetch drawings!");
            }
        };

        yes();
    }, []);

    useEffect(() => console.log(pics.length), [pics]);

    return (
        <div className="max-w-6xl mx-auto border-t py-20 px-4 text-center">
            <div className="flex flex-col">
                <span className="font-display font-bold text-4xl">
                    explore cats
                </span>
                <span className="mt-8 text-lg text-balance opacity-75">
                    see what others have drawn!
                    <br />
                    hover over any drawing to view more info.
                </span>
            </div>

            <div className="flex flex-col mt-8 shadow-2xl border overflow-hidden rounded-2xl w-full">
                <div className="p-2 border-b flex justify-start w-full">
                    <div className="w-fit">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious href="#" />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#">1</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext href="#" />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-[1px] bg-border">
                    {pics.map((item, index) => (
                        <div
                            className="w-full flex flex-col text-start overflow-hidden group bg-white relative"
                            key={index}
                        >
                            <div className="overflow-hidden">
                                <img
                                    className="w-full aspect-square group-hover:scale-105 duration-175"
                                    src={
                                        suapbase.storage
                                            .from("drawings")
                                            .getPublicUrl(`${item.uid}.png`)
                                            .data.publicUrl
                                    }
                                    width={256}
                                    height={256}
                                    alt="cat drawing"
                                    draggable={false}
                                />
                                {/* <Image
                                    className="w-full aspect-square group-hover:scale-105 duration-175"
                                    src={"/cat_drawing.png"}
                                    width={256}
                                    height={256}
                                    alt="cat drawing"
                                /> */}
                            </div>
                            <div className="p-4 flex flex-col gap-2 absolute bg-white bottom-0 translate-y-full group-hover:translate-y-0 duration-175 w-full border-t">
                                <span className="font-bold font-display text-2xl">
                                    {item.name}
                                </span>
                                <div className="flex justify-between items-end">
                                    <div className="flex gap-2">
                                        <Button
                                            variant={"outline"}
                                            size={"icon"}
                                        >
                                            <Heart />
                                        </Button>
                                        <Button
                                            variant={"outline"}
                                            size={"icon"}
                                        >
                                            <Share2 />
                                        </Button>
                                    </div>

                                    <div className="flex flex-col gap-1 items-end">
                                        <span className="text-xs font-semibold opacity-50">
                                            {"..." + item.uid.slice(-10)}
                                        </span>
                                        <span className="text-xs font-semibold opacity-50">
                                            {formatDate(item.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
