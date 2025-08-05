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
                    <div>
                        <CanvasWrapper />
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>drawing name</Label>
                            <Input
                                placeholder="my awesome cat"
                                value={inputs["drawing_name"] || ""}
                                onChange={(e) =>
                                    setInput("drawing_name", e.target.value)
                                }
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={handleDownload}
                                variant="outline"
                                className="flex-1"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                download
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={!user}
                                className="flex-1"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                save
                            </Button>
                        </div>

                        {!user && (
                            <p className="text-sm text-muted-foreground">
                                sign in to save your drawing
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
