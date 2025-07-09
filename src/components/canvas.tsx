import { Eraser, Pen, Redo, Undo, Upload } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Button } from "./ui/button";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { useEffect, useRef, useState } from "react";
import { Slider } from "./ui/slider";
// import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function Canvas() {
    const [eraseMode, setEraseMode] = useState(false);
    const [strokeWidth, setStrokeWidth] = useState(8);
    const [eraserSize, setEraserSize] = useState(12);

    const canvasRef = useRef<ReactSketchCanvasRef>(null);

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

        canvasRef.current.exportSvg().then((svgMarkup) => {
            const largeSvg = svgMarkup
                .replace(/width="[^"]+"/, 'width="512"')
                .replace(/height="[^"]+"/, 'height="512"');

            const blob = new Blob([largeSvg], { type: "image/svg+xml" });
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

    return (
        <div className="flex flex-col mt-8 border shadow-2xl mx-auto rounded-2xl overflow-hidden">
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
                    size={"default"}
                    onClick={() => getPNG()}
                >
                    <Upload />
                    upload drawing
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
                    width="100%"
                    height="100%"
                    strokeWidth={strokeWidth}
                    eraserWidth={eraserSize}
                    ref={canvasRef}
                    className="aspect-square !border-none"
                />
            </div>
        </div>
    );
}
