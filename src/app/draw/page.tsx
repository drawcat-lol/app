"use client";

import CanvasWrapper from "@/components/canvas-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useShouldSubmitStore from "@/stores/should-submit";
import useShouldDownloadStore from "@/stores/should-download";
import useSubmitFormStore from "@/stores/inputs";
import useUserStore from "@/stores/user";
import { Download, Save } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import ConfettiExplosion from "react-confetti-explosion";
import useConfettiStore from "@/stores/should-confetti";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";

export default function DrawPage() {
    const { user } = useUserStore();
    const { inputs, setInput } = useSubmitFormStore();
    const { setShouldSubmit } = useShouldSubmitStore();
    const { setShouldDownload } = useShouldDownloadStore();

    function handleSubmit() {
        if (!inputs["drawing_name"]?.trim()) {
            toast.error("name is required", { richColors: true });
            return;
        }

        setShouldSubmit(true);
    }

    function handleDownload() {
        setShouldDownload(true);
    }
    const { shouldConfetti, setShouldConfetti } = useConfettiStore();

    return (
        <>
            {shouldConfetti && (
                <div className="fixed top-0 right-1/2 pointer-events-none z-50">
                    <ConfettiExplosion
                        onComplete={() => {
                            setShouldConfetti(false);
                            window.location.href = "/";
                        }}
                        force={0.8}
                        duration={2200}
                        particleCount={180}
                        width={1600}
                    />
                </div>
            )}
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 flex flex-col items-center text-center">
                <div className="mb-8 flex flex-col items-center">
                    <h1 className="text-6xl font-bold w-fit font-display mb-8">
                        just draw
                        <br />a cat lol
                    </h1>
                    <p className="text-muted-foreground w-fit text-lg">
                        bad at drawing? that's purrfect.
                        <br />
                        we love poorly drawn cats.
                    </p>
                </div>

                <div className="space-y-8">
                    <CanvasWrapper />

                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <Button
                                onClick={handleDownload}
                                variant="outline"
                                className="flex-1"
                            >
                                <Download />
                                download png
                            </Button>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="flex-1" disabled={!user}>
                                        <Save />
                                        submit
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            name your masterpiece
                                        </DialogTitle>
                                        {/* <DialogDescription>
                                            give your masterpiece a name so it
                                            can be easily searched up!
                                        </DialogDescription> */}
                                    </DialogHeader>
                                    <Input
                                        autoFocus
                                        placeholder="my awesome cat"
                                        value={inputs["drawing_name"] || ""}
                                        onChange={(e) =>
                                            setInput(
                                                "drawing_name",
                                                e.target.value
                                            )
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleSubmit();
                                            }
                                        }}
                                    />
                                    <DialogFooter>
                                        <div className="flex justify-end gap-2 mt-4">
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    document.activeElement instanceof
                                                        HTMLElement &&
                                                    document.activeElement.blur()
                                                }
                                            >
                                                cancel
                                            </Button>
                                            <Button onClick={handleSubmit}>
                                                submit
                                            </Button>
                                        </div>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
