import { Button } from "./ui/button";
import {
    Heart,
    Search,
    SquareArrowOutUpRight,
    Flashlight,
    Plus,
    MoreHorizontal,
    Trash2,
    LogOut,
} from "lucide-react";
import {
    Pagination,
    PaginationContent,
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { formatDate } from "@/lib/utils";
import useReloadExploreStore from "@/stores/reload";
import useUserStore from "@/stores/user";
import { Separator } from "./ui/separator";
import { useTheme } from "next-themes";

export default function Explore({ pageNumber }: { pageNumber: number }) {
    const [listItems, setListItems] = useState<any[]>([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [finalSearchTerm, setFinalSearchTerm] = useState("");

    const [perPageLimit, setPerPageLimit] = useState(100);
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
        suapbase.storage.from("sketches").getPublicUrl(`${uid}.png`).data
            .publicUrl;

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

    const { theme, setTheme } = useTheme();

    async function handleUserDrawingDelete() {
        if (!user) return;

        const { error, count } = await suapbase
            .from("list_v2")
            .delete({ count: "exact" })
            .eq("uid", user.id);

        if (error) {
            toast.error("couldn't delete your drawing!", { richColors: true });
        } else if (count === 0) {
            toast.error("you didn't even draw a cat!", { richColors: true });
        } else {
            toast.success("your drawing has been deleted :(", {
                richColors: true,
            });

            setShouldReloadExplore(true);
        }
    }
    function handleSubmitDrawing() {
        if (user) {
            window.location.href = "/draw";
        } else {
            window.location.href = "/auth/login/discord";
        }
    }

    function handleLogout() {
        suapbase.auth.signOut();
        window.location.href = "/";
    }

    return (
        <div className="flex flex-col w-full h-fit">
            <div className="p-2 border-b flex gap-2 w-full">
                <a href="/">
                    <span
                        className={`font-display font-black my-auto px-3 text-2xl ${
                            theme !== undefined && theme === "dark" ? "color-animate" : ""
                        }`}
                    >
                        drawcat
                    </span>
                </a>

                <div className="w-full"></div>

                <div className="hidden md:block">
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                            setTheme(theme === "light" ? "dark" : "light")
                        }
                    >
                        <Flashlight
                            fill={theme === "dark" ? "white" : "none"}
                        />
                    </Button>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                        <Dialog>
                            <DialogTrigger asChild>
                                <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                >
                                    <Trash2 />
                                    delete drawing
                                </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>delete drawing</DialogTitle>
                                    <DialogDescription>
                                        are you sure you want to delete your
                                        drawing? this action cannot be undone.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button variant="outline">cancel</Button>
                                    <Button
                                        variant="destructive"
                                        onClick={handleUserDrawingDelete}
                                    >
                                        delete
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut />
                            log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="relative w-fit">
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

                <Button onClick={handleSubmitDrawing}>
                    <Plus />
                    submit drawing
                </Button>

                {/* <div className="w-fit">
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

                            <PaginationItem>
                                <PaginationNext
                                    href={`/?page=${pageNumber + 1}`}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div> */}
            </div>
            <div className="w-full bg-border">
                {listItems.length === 0 ? (
                    <div className="p-4">
                        <span className="text-sm font-medium opacity-75">
                            loading...
                        </span>
                    </div>
                ) : (
                    <div
                        className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-px`}
                    >
                        {listItems.map((item, index) => {
                            const imageSrc = getDrawingUrl(item.uid);

                            return (
                                <Dialog key={index}>
                                    <DialogTrigger>
                                        <div className="w-full flex flex-col text-start overflow-hidden group bg-background cursor-pointer">
                                            <div className="overflow-hidden relative">
                                                <img
                                                    className={`w-full aspect-square duration-175 ${
                                                        theme === "light" &&
                                                        "group-hover:scale-110"
                                                    }`}
                                                    src={imageSrc}
                                                    width={256}
                                                    height={256}
                                                    alt="cat drawing"
                                                    draggable={false}
                                                    loading={"lazy"}
                                                />

                                                <div
                                                    className={`absolute inset-0 opacity-0 ${
                                                        theme === "dark" &&
                                                        "opacity-100"
                                                    } bg-black/75 hover:bg-black/0 duration-175`}
                                                ></div>
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
                                                    {removeHashZero(
                                                        item.profiles
                                                            .raw_user_meta_data
                                                            .name
                                                    )}
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
