import Image from "next/image";
import { Button } from "./ui/button";
import {
    Heart,
    Info,
    Link2,
    LinkIcon,
    Search,
    Share2,
    SquareArrowOutUpRight,
    X,
} from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { FormEvent, useEffect, useState } from "react";
import { removeHashZero, suapbase } from "@/lib/utils";
import { toast } from "sonner";
import { Input } from "./ui/input";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
    DialogHeader,
} from "./ui/dialog";
import { formatDate } from "@/lib/utils";
import ReportButton from "./report-button";
import useReloadExploreStore from "@/stores/reload";
import Link from "next/link";
import { Badge } from "./ui/badge";
import useUserStore from "@/stores/user";

export default function Explore({ pageNumber }: { pageNumber: number }) {
    const [listItems, setListItems] = useState<any[]>([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [finalSearchTerm, setFinalSearchTerm] = useState("");

    const [perPageLimit, setPerPageLimit] = useState(12);
    const [totalItemsCount, setTotalItemsCount] = useState<number | null>(null);

    const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});
    const { shouldReloadExplore, setShouldReloadExplore } =
        useReloadExploreStore();
    useEffect(() => {
        const yes = async () => {
            const { data, count, error } = await suapbase
                .from("list_v2")
                .select("*, profiles:uid(*)", { count: "exact" })
                .ilike("name", `%${finalSearchTerm}%`)
                .order("created_at", { ascending: false })
                .range(
                    (pageNumber - 1) * perPageLimit,
                    pageNumber * perPageLimit - 1
                );

            if (!error) {
                setListItems(data);
                setTotalItemsCount(count);
            } else {
                toast.error("couldn't fetch drawings!", { richColors: true });
            }

            setShouldReloadExplore(false);
        };

        yes();
    }, [finalSearchTerm, pageNumber, shouldReloadExplore]);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setFinalSearchTerm(searchTerm);
    }

    const getDrawingUrl = (uid: string) =>
        suapbase.storage.from("sketches").getPublicUrl(`${uid}.png`).data
            .publicUrl;

    const getPages = (pageNumber: number) => {
        if (pageNumber <= 2) return [1, 2, 3];
        return [pageNumber - 1, pageNumber, pageNumber + 1];
    };

    function copyShareLink(url: string) {
        navigator.clipboard.writeText(url).then(() => {
            toast.success("copied to clipboard!", { richColors: true });
        });
    }

    const { user } = useUserStore();
    async function handleLike(itemId: string, to: string) {
        if (!user) return;

        const { error } = await suapbase.from("likes").insert({
            id: itemId,
            from: user.id,
            to: to,
        });

        if (error) {
            console.error("Error liking:", error);
        }
    }

    return (
        <div className="flex flex-col shadow-xl border overflow-hidden rounded-2xl w-full h-fit">
            <div className="p-2 border-b flex gap-2 justify-between w-full flex-col items-end sm:flex-row">
                <div className="relative w-full sm:w-fit">
                    <form onSubmit={handleSubmit}>
                        <Input
                            placeholder="search drawings"
                            className="pr-10"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search
                            className="absolute right-3 top-1/2 h-4 w-4 text-muted-foreground -translate-y-1/2"
                            onClick={handleSubmit}
                        />
                    </form>
                </div>
                <div className="w-fit">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href={`/?page=${Math.max(
                                        1,
                                        pageNumber - 1
                                    )}`}
                                ></PaginationPrevious>
                            </PaginationItem>

                            {getPages(pageNumber).map((page) => (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        href={`/?page=${page}`}
                                        isActive={page === pageNumber}
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            {/* {totalItemsCount &&
                            totalItemsCount > perPageLimit * 36 ? (
                                <PaginationEllipsis />
                            ) : null} */}

                            <PaginationItem>
                                <PaginationNext
                                    href={`/?page=${pageNumber + 1}`}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
            <div className="w-full">
                {listItems.length === 0 ? (
                    <div className="p-4">
                        <span className="text-sm font-medium opacity-75">
                            loading...
                        </span>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-border">
                        {listItems.map((item, index) => (
                            <div
                                className="w-full flex flex-col text-start overflow-hidden group bg-background relative"
                                key={index}
                            >
                                <div className="overflow-hidden relative">
                                    <Image
                                        className="w-full aspect-square duration-175 group-hover:scale-110"
                                        src={getDrawingUrl(item.uid)}
                                        width={256}
                                        height={256}
                                        alt="cat drawing"
                                        draggable={false}
                                        loading={"lazy"}
                                    />

                                    <div className="absolute p-2 top-0 right-0 block lg:hidden">
                                        <Button
                                            size={"icon"}
                                            variant={"outline"}
                                        >
                                            <Info />
                                        </Button>
                                    </div>
                                </div>
                                <div className="absolute p-2 bottom-0 right-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-175 bg-gradient-to-b from-black/0 to-black/100 w-full h-3/4">
                                    <div className="size-full flex justify-between items-end gap-2">
                                        <div className="flex flex-col gap-px text-white">
                                            <span className="font-medium text-sm">
                                                {item.name}
                                            </span>
                                            <span className="text-xs opacity-75">
                                                {removeHashZero(
                                                    item.profiles
                                                        .raw_user_meta_data.name
                                                )}
                                            </span>
                                        </div>
                                        {/* <Badge
                                            asChild
                                            onClick={() =>
                                                handleLike(item.id, item.uid)
                                            }
                                        >
                                            <button className="cursor-pointer">
                                                <Heart className="hover:fill-black" />
                                                0
                                            </button>
                                        </Badge> */}

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Badge
                                                    asChild
                                                    className="cursor-pointer"
                                                    onClick={() =>
                                                        copyShareLink(
                                                            `${window.location.origin}/${item.uid}`
                                                        )
                                                    }
                                                >
                                                    <button>
                                                        <SquareArrowOutUpRight className="hover:fill-black" />
                                                        share
                                                    </button>
                                                </Badge>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        share drawing
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        here's a link to this
                                                        drawing!
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <Input
                                                    readOnly
                                                    defaultValue={`${window.location.origin}/${item.uid}`}
                                                />
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                                {/* <div className="p-4 flex flex-col gap-2 absolute bg-background bottom-0 translate-y-full group-hover:translate-y-0 duration-175 w-full border-t">
                                    <span className="text-sm font-semibold">
                                        {item.name}
                                    </span>
                                    <div className="flex justify-between">
                                        <div className="flex flex-col gap-1 justify-end">
                                            <span className="text-xs font-semibold opacity-50">
                                                {removeHashZero(
                                                    item.profiles
                                                        .raw_user_meta_data.name
                                                )}
                                            </span>
                                            <span className="text-xs font-semibold opacity-50">
                                                {formatDate(item.created_at)}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex gap-2">
                                                <ReportButton item={item} />
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            size={"icon"}
                                                            onClick={() =>
                                                                copyShareLink(
                                                                    `${window.location.origin}/${item.uid}`
                                                                )
                                                            }
                                                        >
                                                            <Share2 />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                share drawing
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                here's a link to
                                                                this drawing!
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <Input
                                                            readOnly
                                                            defaultValue={`${window.location.origin}/${item.uid}`}
                                                        />
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
