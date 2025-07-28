"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { removeHashZero, suapbase } from "@/lib/utils";
import ReportButton from "./report-button";
import { Button } from "./ui/button";
import { ArrowLeft, Download } from "lucide-react";

export default function DrawingDetails({ id }: { id: string }) {
    const [data, setData] = useState<any>(null);
    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        const publicUrl = suapbase.storage
            .from("drawings")
            .getPublicUrl(`${id}.png`, { download: true }).data.publicUrl;

        if (!publicUrl.endsWith("undefined.png")) {
            setUrl(publicUrl);
        }

        suapbase
            .from("list_v2")
            .select("*, profiles:uid(*)")
            .match({ uid: id })
            .single()
            .then(({ data, error }) => {
                if (!error) setData(data);
            });
    }, [id]);

    function downloadDrawing(url: string) {
        const a = document.createElement("a");
        a.href = url;
        a.download = "";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    if (!data) return <p>loading...</p>;

    return (
        <>
            <div className="fixed top-0 left-0 p-4">
                <Button
                    variant={"outline"}
                    onClick={() => (window.location.href = "/")}
                >
                    <ArrowLeft />
                    home
                </Button>
            </div>
            <div className="max-w-lg mx-auto py-20 px-4 md:px-6">
                <div className="rounded-2xl border overflow-hidden shadow-xl flex flex-col">
                    {url && (
                        <Image
                            src={url}
                            width={256}
                            height={256}
                            alt="cat drawing"
                            className="w-full h-full pointer-events-none"
                            draggable={false}
                        />
                    )}
                </div>

                <div className="mt-8 flex justify-between">
                    <span className="text-3xl font-display font-bold">
                        {data.name}
                    </span>

                    <div className="flex gap-2">
                        <ReportButton item={data} />
                        {url && (
                            <Button
                                size={"icon"}
                                variant={"outline"}
                                onClick={() => downloadDrawing(url)}
                            >
                                <Download />
                            </Button>
                        )}
                    </div>
                </div>

                <div className="mt-2 font-medium opacity-75">
                    by{" "}
                    <span className="underline underline-offset-2">
                        {removeHashZero(
                            data.profiles.raw_user_meta_data.name as string
                        )}
                    </span>
                </div>
            </div>
        </>
    );
}
