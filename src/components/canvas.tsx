import { Circle, Eraser, Pen, Redo, Undo, Upload } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Button } from "./ui/button";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Slider } from "./ui/slider";
// import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function Canvas() {
    const [eraseMode, setEraseMode] = useState(false);
    const [strokeWidth, setStrokeWidth] = useState(8);
    const [eraserSize, setEraserSize] = useState(12);
    const [strokeColor, setStrokeColor] = useState("#000");

    const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
    const [backgroundImage, setBackgroundImage] = useState("");

    const canvasRef = useRef<ReactSketchCanvasRef>(null);
    const inputColorRef = useRef<HTMLInputElement>(null);
    const inputFileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        canvasRef.current.eraseMode(eraseMode);
    }, [eraseMode]);

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.ctrlKey && e.key.toLowerCase() === "z") {
                e.preventDefault();
                if (e.shiftKey) {
                    handleUndoRedo("redo");
                } else {
                    handleUndoRedo("undo");
                }
            } else if (e.ctrlKey && e.key.toLowerCase() === "y") {
                e.preventDefault();
                handleUndoRedo("redo");
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    function handleUndoRedo(value: string) {
        if (!canvasRef.current) return;
        value === "undo" ? canvasRef.current.undo() : canvasRef.current.redo();
    }

    function getPNG() {
        if (!canvasRef.current) return;

        canvasRef.current.exportSvg().then((value) => {
            const markup = value
                .replace(/width="[^"]+"/, 'width="512"')
                .replace(/height="[^"]+"/, 'height="512"');

            const blob = new Blob([markup], { type: "image/svg+xml" });
            const url = URL.createObjectURL(blob);
            download(url, "drawing.svg");
            URL.revokeObjectURL(url);
        });
    }

    function download(dataUrl: string, filename: string) {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function handleUpload(e: ChangeEvent<HTMLInputElement>) {
        if (!canvasRef.current) return;
        canvasRef.current.clearCanvas();

        const file = e.currentTarget.files?.[0];
        if (file && file.type === "image/png") {
            // const reader = new FileReader();
            // reader.onload = () => {
            //     const dataURL = reader.result as string;
            //     console.log(dataURL);
            //     setBackgroundImage(dataURL);
            // };
            setBackgroundFile(file);
        }
    }

    useEffect(() => {
        if (!backgroundFile) return;

        const reader = new FileReader();
        reader.onload = () => {
            setBackgroundImage(reader.result as string);
        };
        reader.readAsDataURL(backgroundFile);
    }, [backgroundFile]);

    return (
        <div className="flex flex-col mt-8 border shadow-2xl w-fit rounded-2xl overflow-hidden">
            <div className="p-2 border-b flex gap-2 justify-between w-full">
                <div className="flex gap-2">
                    <ToggleGroup
                        variant={"outline"}
                        type="single"
                        defaultValue="pen"
                        size={"default"}
                        onValueChange={(value) =>
                            setEraseMode(value === "eraser" ? true : false)
                        }
                    >
                        <ToggleGroupItem value="pen">
                            <Pen />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="eraser">
                            <Eraser />
                        </ToggleGroupItem>
                    </ToggleGroup>
                    <ToggleGroup
                        variant={"outline"}
                        type="single"
                        size={"default"}
                        value="urmom"
                        onValueChange={(value) => handleUndoRedo(value)}
                    >
                        <ToggleGroupItem value="undo">
                            <Undo />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="redo">
                            <Redo />
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>
                <Button
                    variant={"outline"}
                    size={"icon"}
                    onClick={() => inputColorRef.current?.click()}
                >
                    <Circle fill={strokeColor} />
                    <input
                        className="hidden"
                        type="color"
                        value={strokeColor}
                        onChange={(e) => setStrokeColor(e.currentTarget.value)}
                        ref={inputColorRef}
                    />
                </Button>
                <Button
                    variant={"outline"}
                    onClick={() => inputFileRef.current?.click()}
                >
                    <Upload />
                    upload
                    <input
                        className="hidden"
                        type="file"
                        ref={inputFileRef}
                        onChange={handleUpload}
                        accept="image/png"
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
            <div className="w-full h-full">
                <ReactSketchCanvas
                    width="32px"
                    height="32px"
                    strokeWidth={strokeWidth}
                    eraserWidth={eraserSize}
                    ref={canvasRef}
                    className="aspect-square !border-none"
                    style={{ width: "100%", height: "100%" }}
                    withTimestamp={false}
                    strokeColor={strokeColor}
                    exportWithBackgroundImage={true}
                    backgroundImage={backgroundImage}
                    // backgroundImage="https://github.com/ronykax.png"
                />
            </div>
        </div>
    );
}
