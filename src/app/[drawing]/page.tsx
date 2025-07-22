"use client";

import ReportButton from "@/components/report-button";
import { Button } from "@/components/ui/button";
import { suapbase } from "@/lib/utils";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
    const [url, setUrl] = useState<string | null>();
    const [data, setData] = useState<any>(null);

    const params = useParams();
    const uid = params.drawing;

    useEffect(() => {
        const publicUrl = suapbase.storage
            .from("drawings")
            .getPublicUrl(`${uid}.png`).data.publicUrl;

        if (!publicUrl.endsWith("undefined.png")) {
            setUrl(publicUrl);
        }

        const fetch = async () => {
            const { data, error } = await suapbase
                .from("list")
                .select("*")
                .match({ uid: uid })
                .single();

            if (!error) {
                setData(data);
            }
        };

        fetch();
    }, []);

    return data !== null ? (
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

                    <ReportButton item={data} />
                </div>
            </div>
        </>
    ) : (
        <div className="flex justify-center items-center h-screen">
            <span>loading...</span>
        </div>
    );
}
