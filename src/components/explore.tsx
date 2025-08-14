import { Button } from "./ui/button";
import { Download, Search, SquareArrowOutUpRight } from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { FormEvent, useEffect, useState } from "react";
import { suapbase } from "@/lib/utils";
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
import useReloadExploreStore from "@/stores/reload";
import useUserStore from "@/stores/user";
import ReportButton from "./report-button";

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
                .order("updated_at", { ascending: false })
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
        suapbase.storage
            .from("sketches")
            .getPublicUrl(`${uid}.png`, { download: true }).data.publicUrl;

    const getPages = (pageNumber: number) => {
        if (pageNumber <= 2) return [1, 2, 3];
        return [pageNumber - 1, pageNumber, pageNumber + 1];
    };

    function copyShareLink(url: string) {
        navigator.clipboard.writeText(url).then(() => {
            toast.success("copied to clipboard!");
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

    function downloadDrawing(url: string) {
        const a = document.createElement("a");
        a.href = url;
        a.download = "";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    return (
        <div className="flex flex-col shadow-xl border overflow-hidden w-full h-fit">
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
                        {listItems.map((item, index) => {
                            const imageSrc = getDrawingUrl(item.uid);

                            return (
                                <Dialog key={index}>
                                    <DialogTrigger>
                                        <div className="w-full flex flex-col text-start overflow-hidden group bg-background cursor-pointer">
                                            <div className="overflow-hidden">
                                                <img
                                                    className="w-full aspect-square duration-175 group-hover:scale-110"
                                                    src={imageSrc}
                                                    width={256}
                                                    height={256}
                                                    alt="cat drawing"
                                                    draggable={false}
                                                    loading={"lazy"}
                                                />
                                            </div>
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle className="font-display">
                                                {item.name}
                                            </DialogTitle>
                                            <DialogDescription>
                                                <span className="font-medium underline underline-offset-2">
                                                    {
                                                        item.profiles
                                                            .raw_user_meta_data
                                                            .name
                                                    }
                                                </span>
                                                <span className="mx-2">•</span>
                                                <span>
                                                    {formatDate(
                                                        item.created_at
                                                    )}
                                                </span>
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="w-full">
                                            <img
                                                src={imageSrc}
                                                width={512}
                                                height={512}
                                                alt="cat drawingg"
                                                loading={"lazy"}
                                                draggable={false}
                                                className="mx-auto border border-border shadow-xl"
                                            />
                                        </div>
                                        <DialogFooter>
                                            <ReportButton item={item} />
                                            <Button
                                                variant={"outline"}
                                                size={"icon"}
                                                onClick={() =>
                                                    downloadDrawing(imageSrc)
                                                }
                                            >
                                                <Download />
                                            </Button>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        onClick={() =>
                                                            copyShareLink(
                                                                `${window.location.origin}/${item.uid}`
                                                            )
                                                        }
                                                    >
                                                        <SquareArrowOutUpRight />
                                                        share
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
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
