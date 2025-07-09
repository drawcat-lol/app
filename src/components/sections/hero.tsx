import { Download, Upload } from "lucide-react";
import { Button } from "../ui/button";
import Canvas from "../canvas";

export default function Hero() {
    return (
        <div className="max-w-2xl mx-auto px-4 py-28 text-center">
            <div className="flex flex-col">
                <span className="text-6xl font-display font-bold">
                    just draw
                    <br />a cat lol
                </span>

                <span className="mt-8 text-lg text-balance opacity-75">
                    bad at drawing? that's purrfect.
                    <br />
                    we love poorly drawn cats.
                </span>

                <Canvas />

                <div className="mt-10 flex gap-2 justify-center">
                    <Button size={"lg"}>
                        <Upload />
                        upload cat
                    </Button>
                    <Button variant={"ghost"} size={"lg"}>
                        <Download />
                        download png
                    </Button>
                </div>
            </div>
        </div>
    );
}
