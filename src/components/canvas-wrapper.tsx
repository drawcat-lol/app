"use client";

import {
    Circle,
    Eraser,
    Lightbulb,
    Pen,
    Redo,
    Undo,
    Upload,
    X,
} from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import Canvas, { CanvasHandle } from "./canvas";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { HexColorPicker } from "react-colorful";
import useStartedDrawingStore from "@/stores/started-drawing";
import useShouldDownloadStore from "@/stores/should-download";
import { toast } from "sonner";
import { downloadBlob, suapbase, uploadToBucket, whiteBbg } from "@/lib/utils";
import useShouldSubmitStore from "@/stores/should-submit";
import useUserStore from "@/stores/user";
import useInputStore from "@/stores/inputs";
import useConfettiStore from "@/stores/should-confetti";
import useReloadExploreStore from "@/stores/reload";

export default function CanvasWrapper() {
    const { user } = useUserStore();

    const [eraseMode, setEraseMode] = useState(false);
    const [strokeWidth, setStrokeWidth] = useState(4);
    const [eraserSize, setEraserSize] = useState(12);
    const [strokeColor, setStrokeColor] = useState("#000000");

    const canvasRef = useRef<CanvasHandle>(null);
    const inputFileRef = useRef<HTMLInputElement>(null);

    const [showIdea, setShowIdea] = useState(false);
    const { startedDrawing } = useStartedDrawingStore();
    const [dontShowIdeaPls, setDontShowIdeaPls] = useState(false);

    const { inputs, resetInputs } = useInputStore();

    const ideas = [
        "cat wearing sunglasses",
        "space cat floating with planets",
        "cat eating noodles",
        "wizard cat casting spells",
        "cat DJ at a party",
        "pirate cat with an eyepatch",
        "cat inside a watermelon",
        "cat riding a skateboard",
        "ninja cat hiding in shadows",
        "cat and dog best friends",
        "robot cat from the future",
        "cat baking cookies",
        "cat stuck in a sock",
        "ghost cat haunting a house",
        "cat fishing in a pond",
        "cowboy cat in the wild west",
        "cat playing video games",
        "cat made of fire",
        "cat in a giant teacup",
        "mermaid cat underwater",
    ];

    const [idea, setIdea] = useState(
        () => ideas[Math.floor(Math.random() * ideas.length)]
    );

    useEffect(() => {
        if (startedDrawing || dontShowIdeaPls) {
            setShowIdea(false);
        } else {
            setShowIdea(true);
        }
    }, [startedDrawing, dontShowIdeaPls]);

    // handle keyboard undo/redo
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (
                e.ctrlKey &&
                (e.key.toLowerCase() === "z" || e.key.toLowerCase() === "y")
            ) {
                e.preventDefault();
                if (
                    e.key.toLowerCase() === "y" ||
                    (e.shiftKey && e.key.toLowerCase() === "z")
                ) {
                    canvasRef.current?.redo();
                } else {
                    canvasRef.current?.undo();
                }
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    function handleUndo() {
        canvasRef.current?.undo();
    }

    function handleRedo() {
        canvasRef.current?.redo();
    }

    function handleUpload(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        canvasRef.current?.loadImage(file);
        setDontShowIdeaPls(true); // dont show the idea prompter if a drawing has been uploaded
    }

    const { shouldDownload, setShouldDownload } = useShouldDownloadStore();
    useEffect(() => {
        if (!shouldDownload) return;
        if (!canvasRef.current) return;

        canvasRef.current
            .exportBlob()
            .then((blob) => {
                downloadBlob(blob, "cat_drawing.png");
            })
            .catch(() => {
                toast.error("couldn't download!", { richColors: true });
            });

        setShouldDownload(false); // should not download after downloading
    }, [shouldDownload]);

    const { setShouldConfetti } = useConfettiStore();
    const { setShouldReloadExplore } = useReloadExploreStore();
    const { shouldSubmit, setShouldSubmit } = useShouldSubmitStore();
    useEffect(() => {
        if (!user) return;
        if (!shouldSubmit) return;

        const upload = async () => {
            const exportedBlob = await canvasRef.current?.exportBlob();
            if (!exportedBlob) return;

            const blob = await whiteBbg(exportedBlob);

            const { error: fileUploadError } = await uploadToBucket(
                blob,
                `${user.id}.png`,
                "sketches"
            );

            const { error: dataUploadError } = await suapbase
                .from("list_v2")
                .upsert(
                    {
                        uid: user.id,
                        name: inputs["drawing_name"] || "untitled cat",
                    },
                    { onConflict: "uid" }
                );

            if (fileUploadError || dataUploadError) {
                toast.error("something went wrong!", { richColors: true });
            } else {
                toast.success("nice!", { richColors: true });

                setShouldConfetti(true);
                setShouldReloadExplore(true);
            }
        };

        upload();

        setShouldSubmit(false); // should not submit after submitting
        resetInputs();
    }, [shouldSubmit]);

    return (
        <div className="flex flex-col border shadow-xl w-fit rounded-2xl overflow-hidden">
            <div className="p-2 border-b flex gap-2 justify-between w-full">
                <div className="flex gap-2">
                    <ToggleGroup
                        variant="outline"
                        type="single"
                        size="default"
                        value={eraseMode ? "eraser" : "pen"}
                    >
                        <ToggleGroupItem
                            value="pen"
                            onClick={() => setEraseMode(false)}
                        >
                            <Pen />
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value="eraser"
                            onClick={() => setEraseMode(true)}
                        >
                            <Eraser />
                        </ToggleGroupItem>
                    </ToggleGroup>
                    <ToggleGroup
                        variant="outline"
                        type="single"
                        size="default"
                        value="none"
                    >
                        <ToggleGroupItem value="undo" onClick={handleUndo}>
                            <Undo />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="redo" onClick={handleRedo}>
                            <Redo />
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Circle fill={strokeColor} />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent asChild>
                        <HexColorPicker
                            color={strokeColor}
                            onChange={(e) => setStrokeColor(e)}
                        />
                    </PopoverContent>
                </Popover>
                <Button
                    variant="outline"
                    onClick={() => inputFileRef.current?.click()}
                >
                    <Upload />
                    upload
                    <input
                        className="hidden"
                        type="file"
                        accept="image/png"
                        ref={inputFileRef}
                        onChange={handleUpload}
                    />
                </Button>
            </div>
            <div className="p-4 border-b">
                <Slider
                    defaultValue={[strokeWidth]}
                    max={100}
                    step={1}
                    onValueChange={(value) =>
                        eraseMode
                            ? setEraserSize(value[0])
                            : setStrokeWidth(value[0])
                    }
                    value={[eraseMode ? eraserSize : strokeWidth]}
                />
            </div>
            <div className="relative">
                <Canvas
                    ref={canvasRef}
                    eraseMode={eraseMode}
                    strokeWidth={strokeWidth}
                    eraserSize={eraserSize}
                    strokeColor={strokeColor}
                />
                {showIdea && (
                    <div className="absolute bottom-0 right-0 p-2 animate-idea">
                        <button
                            className="text-sm opacity-75 font-medium border-border rounded-full px-3 py-1 border bg-background flex gap-1 items-center hover:bg-accent duration-100"
                            onClick={() =>
                                setIdea(
                                    ideas[
                                        Math.floor(Math.random() * ideas.length)
                                    ]
                                )
                            }
                        >
                            <Lightbulb size={12} />
                            <span>{idea}</span>
                            <div onClick={() => setDontShowIdeaPls(true)}>
                                <X size={16} />
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
