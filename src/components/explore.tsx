import Image from "next/image";
import { Button } from "./ui/button";
import { Check, Cross, Flag, Search, Share2, X } from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { FormEvent, Suspense, useEffect, useState } from "react";
import suapbase from "@/utils/supabase";
import { toast } from "sonner";
import { formatDate } from "@/utils/formatDate";
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
import { Textarea } from "./ui/textarea";
import useUserStore from "@/stores/user";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Explore() {
    const { user } = useUserStore();
    const [pics, setPics] = useState<any[]>([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [finalSearchTerm, setFinalSearchTerm] = useState("");
    const [reportDescription, setReportDescription] = useState("");

    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");

    const router = useRouter();

    useEffect(() => {
        const yes = async () => {
            const { data, error } = await suapbase
                .from("list")
                .select("*")
                .ilike("name", `%${finalSearchTerm}%`)
                .order("created_at", { ascending: false })
                // .range((page - 1) * 12, page * 12 - 1);
                .limit(20);

            if (!error) {
                setPics(data);
            } else {
                toast.error("couldn't fetch drawings!", { richColors: true });
            }
        };

        yes();
    }, [finalSearchTerm, page]);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setFinalSearchTerm(searchTerm);
    }

    async function handleReport(reporting: string) {
        if (user) {
            const { error } = await suapbase.from("reports").insert({
                description: reportDescription,
                from: user.id,
                reporting,
            });

            if (error) {
                toast.error("something went wrong! try again later.", {
                    richColors: true,
                });
            } else {
                toast.success("we've recieved your report!", {
                    richColors: true,
                });

                setReportDescription("");
            }
        } else {
            toast.warning("please log in first!", { richColors: true });
        }
    }

    const goToPage = (p: number) => {
        router.push(`/?page=${p}`);
    };

    return (
        <div className="flex flex-col shadow-xl border overflow-hidden rounded-2xl w-full h-fit">
            <div className="p-2 border-b flex gap-2 justify-between w-full">
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
                <div className="w-fit">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() =>
                                        goToPage(Math.max(1, page - 1))
                                    }
                                />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink onClick={() => goToPage(1)}>
                                    1
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink onClick={() => goToPage(2)}>
                                    2
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => goToPage(page + 1)}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
            <div className="w-full">
                {pics.length === 0 ? (
                    <div className="p-4">
                        <span className="text-sm font-medium opacity-75">
                            loading...
                        </span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-border">
                        {pics.map((item, index) => (
                            <div
                                className="w-full flex flex-col text-start overflow-hidden group bg-white relative"
                                key={index}
                            >
                                <div className="overflow-hidden">
                                    <Image
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
                                </div>
                                <div className="p-4 flex flex-col gap-2 absolute bg-white bottom-0 translate-y-full group-hover:translate-y-0 duration-175 w-full border-t">
                                    <span className="font-bold font-display text-xl">
                                        {item.name}
                                    </span>
                                    <div className="flex justify-between items-end">
                                        <div className="flex gap-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        size={"icon"}
                                                    >
                                                        <Flag />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            report drawing
                                                        </DialogTitle>
                                                        <DialogDescription
                                                            asChild
                                                        >
                                                            <p className="text-muted-foreground text-sm">
                                                                you're about to
                                                                report this user
                                                                for submitting a
                                                                drawing that
                                                                breaks the
                                                                rules. drawings
                                                                usually get
                                                                reported for
                                                                reasons like:
                                                                <br />
                                                            </p>
                                                            {/* <ul className="list-disc list-inside text-muted-foreground text-sm">
                                                                <li>
                                                                    it's NSFW
                                                                </li>
                                                                <li>
                                                                    it's not a
                                                                    cat
                                                                </li>
                                                                <li>
                                                                    it's a dog
                                                                </li>
                                                                <li>
                                                                    it contains
                                                                    gore
                                                                </li>
                                                            </ul> */}
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <Textarea
                                                        placeholder="describe what's wrong with this drawing"
                                                        value={
                                                            reportDescription
                                                        }
                                                        onChange={(e) =>
                                                            setReportDescription(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <DialogFooter>
                                                        <Button
                                                            size={"lg"}
                                                            onClick={() =>
                                                                handleReport(
                                                                    item.uid
                                                                )
                                                            }
                                                        >
                                                            <Check />
                                                            submit
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        size={"icon"}
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
                                                            your drawing!
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <Input
                                                        readOnly
                                                        defaultValue={
                                                            "https://drawcat.lol"
                                                        }
                                                    />
                                                    <DialogFooter>
                                                        <Button size={"lg"}>
                                                            <X />
                                                            close
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
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
                )}
            </div>
        </div>
    );
}
