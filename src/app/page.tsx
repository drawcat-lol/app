"use client";

import CanvasWrapper from "@/components/canvas-wrapper";
import Explore from "@/components/explore";
import { Button } from "@/components/ui/button";
import useBlobStore from "@/stores/blob";
import useShouldSubmitStore from "@/stores/should-submit";
import useUserStore from "@/stores/user";
import suapbase from "@/utils/supabase";
import { Check, Cross, Download, X } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useShouldDownloadStore from "@/stores/should-download";
import { cn } from "@/lib/utils";

export default function Hero() {
    const { user } = useUserStore();

    const { shouldSubmit, setShouldSubmit } = useShouldSubmitStore();
    const { shouldDownload, setShouldDownload } = useShouldDownloadStore();
    const { blob } = useBlobStore();

    const [submitForm, setSubmitForm] = useState({ name: "", description: "" });

    function handleSubmit() {
        setShouldSubmit(true);
    }

    function handleDownload() {
        setShouldDownload(true);
    }

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
                        description: submitForm.description,
                    },
                    { onConflict: "uid" }
                );

            if (storageUploadError || dataUploadError) {
                toast.error("something went wrong!", {
                    richColors: true,
                    className: "",
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
            <div className="bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,rgb(255,140,55,0.5)_100%)]">
                <div className="max-w-2xl mx-auto px-4 py-28 text-center">
                    <div className="flex flex-col">
                        <span className="text-6xl font-display font-bold">
                            just draw
                            <br />a cat lol
                        </span>

                        <span className="mt-8 text-lg text-balance opacity-75">
                            bad at drawing? that's purrfect.
                            <br />
                            we love poorly drawn cats.
                        </span>

                        <div
                            className={cn(
                                "w-fit mx-auto mt-8 duration-200",
                                !user &&
                                    "relative overflow-hidden rounded-2xl border"
                            )}
                        >
                            {!user && (
                                <div className="absolute inset-0 backdrop-blur-[2px] z-10 bg-white/75 flex justify-center items-center">
                                    <div className="flex flex-col gap-4 items-center">
                                        <span className="px-6 text-balance opacity-75">
                                            please login{" "}
                                            <a
                                                className="underline underline-offset-2"
                                                href="/auth/login/discord"
                                            >
                                                here
                                            </a>{" "}
                                            to
                                            <br />
                                            start drawing!
                                        </span>
                                        {/* <Button className="w-fit">
                                            sign in
                                        </Button> */}
                                    </div>
                                </div>
                            )}
                            <CanvasWrapper />
                        </div>

                        <div className="mt-10 flex gap-2 justify-center">
                            <Dialog>
                                <DialogTrigger type="button" asChild>
                                    <Button
                                        size={"lg"}
                                        // onClick={handleSubmit}
                                        disabled={user ? false : true}
                                    >
                                        <Check />
                                        submit
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            describe your masterpiece
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="grid flex-1 gap-2">
                                                <Label>name</Label>
                                                <Input
                                                    placeholder="black cat"
                                                    onChange={(e) =>
                                                        setSubmitForm({
                                                            name: e.target
                                                                .value,
                                                            description:
                                                                submitForm.description,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="grid flex-1 gap-2">
                                                <Label>description</Label>
                                                <Textarea
                                                    placeholder="this is a cat from africa"
                                                    onChange={(e) =>
                                                        setSubmitForm({
                                                            name: submitForm.name,
                                                            description:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
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
                </div>
            </div>
            <Explore />
        </>
    );
}
