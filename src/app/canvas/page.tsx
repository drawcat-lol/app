"use client";

import { useEffect, useRef, useState } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";

export default function Page() {
    const [strokeWidth, setStrokeWidth] = useState(10);
    const [eraseWidth, setEraseWidth] = useState(10);

    const [strokeColor, setStrokeColor] = useState("#000");
    const [eraseMode, setEraseMode] = useState(false);

    const canvasRef = useRef<ReactSketchCanvasRef>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        canvasRef.current.eraseMode(eraseMode);
    }, [eraseMode]);

    return (
        <div>
            <ReactSketchCanvas
                width="512px"
                height="512px"
                strokeColor={strokeColor}
                strokeWidth={strokeWidth}
                eraserWidth={eraseWidth}
                ref={canvasRef}
            />

            <button
                className="px-4 py-2 bg-orange-50 border"
                onClick={() =>
                    !eraseMode
                        ? setStrokeWidth(strokeWidth + 1)
                        : setEraseWidth(eraseWidth + 1)
                }
            >
                increase {eraseMode ? "erase" : "stroke"} width
            </button>
            <button
                className="px-4 py-2 bg-orange-50 border"
                onClick={() =>
                    !eraseMode
                        ? setStrokeWidth(strokeWidth - 1)
                        : setEraseWidth(eraseWidth - 1)
                }
            >
                decrease {eraseMode ? "erase" : "stroke"} width
            </button>
            <input
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.currentTarget.value)}
            />
            <button onClick={() => setEraseMode(!eraseMode)}>
                toggle eraser
            </button>
        </div>
    );
}
