"use client";

import { useSearchParams } from "next/navigation";
import Explore from "@/components/explore";

export default function ExploreWrapper() {
    const params = useSearchParams();
    const pageNumber = parseInt(params.get("page") || "1");

    return <Explore pageNumber={pageNumber} />;
}
