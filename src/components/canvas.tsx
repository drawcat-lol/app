"use client";

import React, {
    forwardRef,
    useEffect,
    useRef,
    useImperativeHandle,
    useState,
} from "react";

export type CanvasHandle = {
    undo: () => void;
    redo: () => void;
    loadImage: (file: File) => void;
};

type Props = {
    strokeWidth: number;
    strokeColor: string;
    eraserSize: number;
    eraseMode: boolean;
};

const Canvas = forwardRef<CanvasHandle, Props>(
    ({ strokeWidth, strokeColor, eraseMode, eraserSize }, ref) => {
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const [drawing, setDrawing] = useState(false);
        const undoStack = useRef<ImageData[]>([]);
        const redoStack = useRef<ImageData[]>([]);

        useImperativeHandle(ref, () => ({
            undo() {
                const canvas = canvasRef.current;
                if (!canvas || undoStack.current.length === 0) return;
                const ctx = canvas.getContext("2d")!;
                const last = undoStack.current.pop()!;
                redoStack.current.push(
                    ctx.getImageData(0, 0, canvas.width, canvas.height)
                );
                ctx.putImageData(last, 0, 0);
            },
            redo() {
                const canvas = canvasRef.current;
                if (!canvas || redoStack.current.length === 0) return;
                const ctx = canvas.getContext("2d")!;
                const next = redoStack.current.pop()!;
                undoStack.current.push(
                    ctx.getImageData(0, 0, canvas.width, canvas.height)
                );
                ctx.putImageData(next, 0, 0);
            },
            loadImage(file: File) {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const ctx = canvas.getContext("2d")!;
                const img = new Image();
                const reader = new FileReader();
                reader.onload = () => {
                    img.src = reader.result as string;
                    img.onload = () => {
                        // save current state
                        undoStack.current.push(
                            ctx.getImageData(0, 0, canvas.width, canvas.height)
                        );
                        redoStack.current = [];
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    };
                };
                reader.readAsDataURL(file);
            },
        }));

        // update drawing settings
        useEffect(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d")!;
            ctx.lineWidth = eraseMode ? eraserSize : strokeWidth;
            ctx.strokeStyle = strokeColor;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.globalCompositeOperation = eraseMode
                ? "destination-out"
                : "source-over";
        }, [strokeWidth, strokeColor, eraseMode, eraserSize]);

        // drawing handlers
        useEffect(() => {
            const canvas = canvasRef.current!;
            const ctx = canvas.getContext("2d")!;
            const scaleX = canvas.width / canvas.offsetWidth;
            const scaleY = canvas.height / canvas.offsetHeight;

            function getPos(e: MouseEvent) {
                const rect = canvas.getBoundingClientRect();
                return {
                    x: (e.clientX - rect.left) * scaleX,
                    y: (e.clientY - rect.top) * scaleY,
                };
            }

            function handleDown(e: MouseEvent) {
                // save for undo
                undoStack.current.push(
                    ctx.getImageData(0, 0, canvas.width, canvas.height)
                );
                redoStack.current = [];
                const pos = getPos(e);
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
                setDrawing(true);
            }

            function handleMove(e: MouseEvent) {
                if (!drawing) return;
                const pos = getPos(e);
                ctx.lineTo(pos.x, pos.y);
                ctx.stroke();
            }

            function handleUp() {
                setDrawing(false);
            }

            canvas.addEventListener("mousedown", handleDown);
            canvas.addEventListener("mousemove", handleMove);
            window.addEventListener("mouseup", handleUp);

            return () => {
                canvas.removeEventListener("mousedown", handleDown);
                canvas.removeEventListener("mousemove", handleMove);
                window.removeEventListener("mouseup", handleUp);
            };
        }, [drawing]);

        return (
            <canvas
                width={256}
                height={256}
                className="bg-white w-full h-full"
                ref={canvasRef}
            />
        );
    }
);

export default Canvas;
