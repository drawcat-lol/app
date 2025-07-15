"use client";

import CanvasWrapper from "@/components/canvas-wrapper";
import Explore from "@/components/explore";
import { Button } from "@/components/ui/button";
import useBlobStore from "@/stores/blob";
import useShouldSubmitStore from "@/stores/should-submit";
import useUserStore from "@/stores/user";
import suapbase from "@/utils/supabase";
import { Check, Download } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Hero() {
    const { user } = useUserStore();

    const { shouldSubmit, setShouldSubmit } = useShouldSubmitStore();
    const { blob } = useBlobStore();

    function handleSubmit() {
        setShouldSubmit(true);
    }

    useEffect(() => {
        if (!user || !blob || !shouldSubmit) return;

        const upload = async () => {
            const { error } = await suapbase.storage
                .from("drawings")
                .upload(`cat_${user.id}.png`, blob, {
                    upsert: true,
                });

            if (error) toast.error("something went wrong!");
            else toast.success("nice!");
        };

        upload();
        setShouldSubmit(false);
    }, [blob, user, shouldSubmit]);

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

                        <div className="w-fit mx-auto mt-8">
                            <CanvasWrapper />
                        </div>

                        <div className="mt-10 flex gap-2 justify-center">
                            <Button
                                size={"lg"}
                                onClick={handleSubmit}
                                disabled={user ? false : true}
                            >
                                <Check />
                                submit
                            </Button>
                            <Button variant={"ghost"} size={"lg"}>
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
