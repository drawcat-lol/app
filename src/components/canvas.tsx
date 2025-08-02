"use client";

import useStartedDrawingStore from "@/stores/started-drawing";
import React, {
    forwardRef,
    useEffect,
    useRef,
    useImperativeHandle,
} from "react";

export type CanvasHandle = {
    undo: () => void;
    redo: () => void;
    loadImage: (file: File) => void;
    exportBlob: () => Promise<Blob>;
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
        const undoStack = useRef<ImageData[]>([]);
        const redoStack = useRef<ImageData[]>([]);
        const drawingRef = useRef(false);

        const { startedDrawing, setStartedDrawing } = useStartedDrawingStore();

        useImperativeHandle(ref, () => ({
            undo() {
                const canvas = canvasRef.current!;
                if (!undoStack.current.length) return;
                const ctx = canvas.getContext("2d", {
                    willReadFrequently: true,
                })!;
                const last = undoStack.current.pop()!;
                redoStack.current.push(
                    ctx.getImageData(0, 0, canvas.width, canvas.height)
                );
                ctx.putImageData(last, 0, 0);
            },

            redo() {
                const canvas = canvasRef.current!;
                if (!redoStack.current.length) return;
                const ctx = canvas.getContext("2d", {
                    willReadFrequently: true,
                })!;
                const next = redoStack.current.pop()!;
                undoStack.current.push(
                    ctx.getImageData(0, 0, canvas.width, canvas.height)
                );
                ctx.putImageData(next, 0, 0);
            },

            loadImage(file: File) {
                const canvas = canvasRef.current!;
                const ctx = canvas.getContext("2d", {
                    willReadFrequently: true,
                })!;
                const img = new Image();
                const reader = new FileReader();

                reader.onload = () => {
                    img.src = reader.result as string;
                    img.onload = () => {
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

            exportBlob(): Promise<Blob> {
                const canvas = canvasRef.current!;
                return new Promise((resolve, reject) => {
                    canvas.toBlob((blob) => {
                        if (blob) resolve(blob);
                        else reject(new Error("failed to get PNG"));
                    }, "image/png");
                });
            },
        }));

        useEffect(() => {
            const canvas = canvasRef.current!;
            const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
            ctx.lineWidth = eraseMode ? eraserSize : strokeWidth;
            ctx.strokeStyle = strokeColor;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.globalCompositeOperation = eraseMode
                ? "destination-out"
                : "source-over";
        }, [strokeWidth, strokeColor, eraseMode, eraserSize]);

        useEffect(() => {
            const canvas = canvasRef.current!;
            const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
            const scaleX = () => canvas.width / canvas.offsetWidth;
            const scaleY = () => canvas.height / canvas.offsetHeight;

            function getPos(e: MouseEvent | TouchEvent) {
                const rect = canvas.getBoundingClientRect();
                const clientX =
                    "touches" in e ? e.touches[0].clientX : e.clientX;
                const clientY =
                    "touches" in e ? e.touches[0].clientY : e.clientY;
                return {
                    x: (clientX - rect.left) * scaleX(),
                    y: (clientY - rect.top) * scaleY(),
                };
            }

            function handleDown(e: MouseEvent | TouchEvent) {
                e.preventDefault();

                if (!startedDrawing) setStartedDrawing(true);

                undoStack.current.push(
                    ctx.getImageData(0, 0, canvas.width, canvas.height)
                );
                redoStack.current = [];
                const { x, y } = getPos(e);
                ctx.beginPath();
                ctx.moveTo(x, y);
                drawingRef.current = true;
            }

            function handleMove(e: MouseEvent | TouchEvent) {
                if (!drawingRef.current) return;
                e.preventDefault();
                const { x, y } = getPos(e);
                ctx.lineTo(x, y);
                ctx.stroke();
            }

            function handleUp() {
                drawingRef.current = false;
            }

            canvas.addEventListener("mousedown", handleDown);
            canvas.addEventListener("mousemove", handleMove);
            window.addEventListener("mouseup", handleUp);
            canvas.addEventListener("touchstart", handleDown, {
                passive: false,
            });
            canvas.addEventListener("touchmove", handleMove, {
                passive: false,
            });
            window.addEventListener("touchend", handleUp);

            return () => {
                canvas.removeEventListener("mousedown", handleDown);
                canvas.removeEventListener("mousemove", handleMove);
                window.removeEventListener("mouseup", handleUp);
                canvas.removeEventListener("touchstart", handleDown);
                canvas.removeEventListener("touchmove", handleMove);
                window.removeEventListener("touchend", handleUp);
            };
        }, []);

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
