"use client";

import CanvasWrapper from "@/components/canvas-wrapper";
import Explore from "@/components/explore";
import { Button } from "@/components/ui/button";
import useBlobStore from "@/stores/blob";
import useShouldSubmitStore from "@/stores/should-submit";
import useUserStore from "@/stores/user";
import { suapbase } from "@/lib/utils";
import { Check, Download, LogOut, X } from "lucide-react";
import { SiDiscord, SiHackclub } from "@icons-pack/react-simple-icons";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useShouldDownloadStore from "@/stores/should-download";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

export default function Hero() {
    const { user } = useUserStore();

    const { shouldSubmit, setShouldSubmit } = useShouldSubmitStore();
    const { shouldDownload, setShouldDownload } = useShouldDownloadStore();
    const { blob } = useBlobStore();

    const [submitForm, setSubmitForm] = useState({ name: "" });
    const [signupbro, setSignupbro] = useState(false);

    const params = useSearchParams();
    const router = useRouter();

    const pageNumber = params.get("page");

    useEffect(() => {
        const page = parseInt(params.get("page") || "0");

        if (!page || page <= 0) {
            router.replace("?page=1");
        }
    }, [params, router]);

    function handleSubmit() {
        setShouldSubmit(true);
    }

    function handleDownload() {
        setShouldDownload(true);
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSignupbro(!user); // show banner only if user is not signed in
        }, 2000);

        return () => clearTimeout(timeout); // cleanup on user change
    }, [user]);

    useEffect(() => {
        if (!user || !blob || !shouldSubmit) return;

        const upload = async () => {
            const { error: storageUploadError } = await suapbase.storage
                .from("drawings")
                .upload(`${user.id}.png`, blob, {
                    upsert: true,
                });

            const { error: dataUploadError } = await suapbase
                .from("list")
                .upsert(
                    {
                        uid: user.id,
                        name: submitForm.name,
                    },
                    { onConflict: "uid" }
                );

            if (storageUploadError || dataUploadError) {
                toast.error("something went wrong!", {
                    richColors: true,
                });
                console.log("error upserting: ", dataUploadError);
            } else {
                toast.success("nice!", { richColors: true });
            }
        };

        upload();
        setShouldSubmit(false);
    }, [blob, user, shouldSubmit]);

    useEffect(() => {
        if (shouldDownload && blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");

            a.href = url;
            a.download = "cat_drawing.png";
            a.click();

            URL.revokeObjectURL(url);
        }
    }, [shouldDownload, blob]);

    return (
        <>
            <div
                className={cn(
                    "fixed w-full p-2 bg-orange-50 border-b flex text-sm items-center duration-200 z-40",
                    signupbro ? "translate-y-0" : "-translate-y-full"
                )}
            >
                <div className="mx-auto">
                    please login{" "}
                    <Dialog>
                        <DialogTrigger className="underline underline-offset-2 cursor-pointer font-semibold">
                            here
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>oauth</DialogTitle>
                            <DialogDescription>
                                we use oauth to make sure people follow the
                                rules and to block anyone who doesn't.
                            </DialogDescription>
                            <div className="flex gap-2 w-full justify-end">
                                <Button
                                    size={"lg"}
                                    onClick={() =>
                                        (location.href = "/auth/login/discord")
                                    }
                                >
                                    <SiDiscord />
                                    discord
                                </Button>
                                <Button
                                    size={"lg"}
                                    onClick={() =>
                                        (location.href =
                                            "/auth/login/slack_oidc")
                                    }
                                >
                                    <SiHackclub />
                                    slack (hackclub)
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>{" "}
                    to submit your drawing!
                </div>
                <Button
                    size={"icon"}
                    variant={"link"}
                    className="cursor-pointer"
                >
                    <X />
                </Button>
            </div>
            <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col gap-16 lg:gap-6 md:gap-6 lg:flex-row py-20">
                <div className="flex flex-col outline-blue-600 w-fit h-fit text-center lg:text-start mx-auto">
                    <span className="text-6xl font-display font-bold">
                        just draw
                        <br />a cat lol
                    </span>

                    <span className="mt-8 text-lg text-balance opacity-75">
                        bad at drawing? that's purrfect.
                        <br />
                        we love poorly drawn cats.
                    </span>

                    <div className="w-fit mt-8">
                        <CanvasWrapper />
                    </div>

                    <div className="mt-10 flex gap-2 justify-center lg:justify-start">
                        <Dialog>
                            <DialogTrigger type="button" asChild>
                                <Button
                                    size={"lg"}
                                    disabled={user ? false : true}
                                >
                                    <Check />
                                    submit
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        name your masterpiece
                                    </DialogTitle>
                                    <DialogDescription>
                                        give your drwaing a name so it can be
                                        easily searched up!
                                    </DialogDescription>
                                </DialogHeader>
                                <Input
                                    placeholder="black cat"
                                    onChange={(e) =>
                                        setSubmitForm({
                                            name: e.target.value,
                                        })
                                    }
                                    autoFocus
                                    required
                                />
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button
                                            size={"lg"}
                                            onClick={handleSubmit}
                                        >
                                            <Check />
                                            confirm
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Button
                            variant={"ghost"}
                            size={"lg"}
                            onClick={handleDownload}
                        >
                            <Download />
                            download png
                        </Button>
                    </div>
                </div>
                <Explore pageNumber={parseInt(pageNumber || "1")} />
            </div>
            {user && (
                <div className="fixed bottom-0 left-0 p-4">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size={"icon"}
                                variant={"outline"}
                                onClick={() =>
                                    (window.location.href = "/auth/logout")
                                }
                            >
                                <LogOut />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>log out</TooltipContent>
                    </Tooltip>
                </div>
            )}
        </>
    );
}
