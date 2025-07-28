import DrawingClient from "@/components/drawing-details";
import { suapbase } from "@/lib/utils";
import { ResolvingMetadata } from "next";

interface Props {
    params: Promise<{ drawing: string }>;
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
) {
    const uid = (await params).drawing;

    const { data: drawingData, error } = await suapbase
        .from("list_v2")
        .select("*")
        .match({ uid: uid })
        .single();

    if (error) {
        console.error(error);
        return;
    }

    const publicUrl = suapbase.storage
        .from("drawings")
        .getPublicUrl(`${uid}.png`).data.publicUrl;

    if (publicUrl.endsWith("undefined.png")) return;

    return {
        title: drawingData.name,
        description: `by ${drawingData.uid}`,
        openGraph: {
            images: [publicUrl],
        },
        twitter: {
            images: [publicUrl],
            card: "summary_large_image",
        },
    };
}

export default async function Page({ params }: Props) {
    const id = (await params).drawing;

    return <DrawingClient id={id} />;
}
