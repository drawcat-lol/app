import { Eraser, Pen, Upload } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Button } from "./ui/button";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { useEffect, useRef, useState } from "react";
import { Slider } from "./ui/slider";
// import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function Canvas() {
    interface Settings {
        strokeWidth: number;
        eraserSize: number;
    }

    const [eraseMode, setEraseMode] = useState(false);
    const [strokeWidth, setStrokeWidth] = useState(8);
    const [eraserSize, setEraserSize] = useState(12);

    const canvasRef = useRef<ReactSketchCanvasRef>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        canvasRef.current.eraseMode(eraseMode);
    }, [eraseMode]);

    return (
        <div className="flex flex-col mt-8 border shadow-2xl mx-auto">
            <div className="p-2 border-b flex gap-2 justify-between w-full">
                <div className="flex gap-2">
                    <ToggleGroup
                        variant={"outline"}
                        type="single"
                        defaultValue="pen"
                        size={"lg"}
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
                </div>
                <Button variant={"outline"} size={"lg"}>
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
            <div className="w-fit h-fit mx-auto">
                <ReactSketchCanvas
                    width="360px"
                    height="360px"
                    strokeWidth={strokeWidth}
                    eraserWidth={eraserSize}
                    ref={canvasRef}
                    className="!border-none w-fit h-fit"
                />
            </div>
        </div>
    );
}
