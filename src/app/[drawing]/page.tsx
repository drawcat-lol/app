"use client";

import { suapbase } from "@/lib/utils";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const [url, setUrl] = useState<string | null>();

    const params = useParams();
    const uid = params.uid;

    useEffect(() => {
        const supaurl = suapbase.storage.from("drawings").getPublicUrl(`${uid}.png`);
    }, []);

    return (
        <div className="max-w-2xl">
            {url && (
                <Image src={""} width={256} height={256} alt="cat drawing" />
            )}
        </div>
    );
}
