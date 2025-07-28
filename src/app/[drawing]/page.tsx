import DrawingDetails from "@/components/drawing-details";
import { removeHashZero, suapbase } from "@/lib/utils";

interface Props {
    params: Promise<{ drawing: string }>;
}

export async function generateMetadata({ params }: Props) {
    const uid = (await params).drawing;

    const { data: drawingData, error } = await suapbase
        .from("list_v2")
        .select("*, profiles:uid(*)")
        .match({ uid: uid })
        .single();

    if (error) {
        console.error(error);
        return;
    }

    const publicUrl = suapbase.storage
        .from("sketches")
        .getPublicUrl(`${uid}.png`).data.publicUrl;

    if (publicUrl.endsWith("undefined.png")) return;

    return {
        title: drawingData.name,
        description: `by ${removeHashZero(
            drawingData.profiles.raw_user_meta_data.name as string
        )}`,
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

    return <DrawingDetails id={id} />;
}
