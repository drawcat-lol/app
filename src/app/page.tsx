"use client";

import CanvasWrapper from "@/components/canvas-wrapper";
import { Button } from "@/components/ui/button";
import useShouldSubmitStore from "@/stores/should-submit";
import useUserStore from "@/stores/user";
import { suapbase, whiteBbg } from "@/lib/utils";
import {
    Check,
    CircleQuestionMark,
    Download,
    ExternalLink,
    LogOut,
    X,
} from "lucide-react";
import {
    SiDiscord,
    SiGithub,
    SiHackclub,
} from "@icons-pack/react-simple-icons";
import { Suspense, useEffect, useState } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useShouldDownloadStore from "@/stores/should-download";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import ExploreWrapper from "@/components/explore-wrapper";
import Footer from "@/components/footer";
import ConfettiExplosion from "react-confetti-explosion";
import useSubmitFormStore from "@/stores/inputs";
import useConfettiStore from "@/stores/should-confetti";

export default () => {
    const { user } = useUserStore();

    // const [submitForm, setSubmitForm] = useState({ name: "" });
    const { setInput } = useSubmitFormStore();
    const [signupbro, setSignupbro] = useState(false);
    const { shouldConfetti, setShouldConfetti } = useConfettiStore();

    const { setShouldSubmit } = useShouldSubmitStore();
    function handleSubmit() {
        setShouldSubmit(true);
    }

    const { setShouldDownload } = useShouldDownloadStore();
    function handleDownload() {
        setShouldDownload(true);
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSignupbro(!user); // show banner only if user is not signed in
        }, 2000);

        return () => clearTimeout(timeout); // cleanup on user change
    }, [user]);

    function redirectToSignin(href: string) {
        setShouldDownload(true);
        window.location.href = href;
    }

    return (
        <>
            {shouldConfetti && (
                <ConfettiExplosion
                    className="fixed top-0 right-1/2"
                    onComplete={() => setShouldConfetti(false)}
                    zIndex={999}
                    force={0.6}
                    duration={2500}
                    particleCount={80}
                    width={1000}
                />
            )}
            <div
                className={cn(
                    "fixed w-full p-4 bg-orange-50 border-b flex text-sm items-center duration-200 z-40",
                    signupbro ? "translate-y-0" : "-translate-y-full"
                )}
            >
                <div className="mx-auto">
                    please login{" "}
                    <Dialog>
                        <DialogTrigger className="underline underline-offset-2 cursor-pointer font-semibold">
                            here
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>oauth</DialogTitle>
                                <DialogDescription>
                                    we use oauth to make sure people follow the
                                    rules and to block anyone who doesn't.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button
                                    size={"lg"}
                                    onClick={() =>
                                        redirectToSignin("/auth/login/discord")
                                    }
                                >
                                    <SiDiscord />
                                    discord
                                </Button>
                                <Button
                                    size={"lg"}
                                    onClick={() =>
                                        redirectToSignin("/auth/login/github")
                                    }
                                >
                                    <SiGithub />
                                    github
                                </Button>
                                <Button
                                    size={"lg"}
                                    onClick={() =>
                                        redirectToSignin(
                                            "/auth/login/slack_oidc"
                                        )
                                    }
                                >
                                    <SiHackclub />
                                    slack (hackclub)
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>{" "}
                    to submit your drawing!
                </div>
            </div>
            <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col gap-16 lg:gap-6 md:gap-6 lg:flex-row py-20">
                <div className="flex flex-col outline-blue-600 w-fit h-fit text-center lg:text-start mx-auto">
                    <span className="text-6xl font-display font-bold">
                        just draw
                        <br />a cat lol
                    </span>

                    <span className="mt-8 text-lg text-balance opacity-75">
                        bad at drawing? that's purrfect.
                        <br />
                        we love poorly drawn cats.
                    </span>

                    <div className="w-fit mt-8">
                        <CanvasWrapper />
                    </div>

                    <div className="mt-10 flex gap-2 justify-center lg:justify-start">
                        <Dialog>
                            <DialogTrigger type="button" asChild>
                                <Button
                                    size={"lg"}
                                    disabled={user ? false : true}
                                    className="relative"
                                >
                                    <Check />
                                    submit
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        name your masterpiece
                                    </DialogTitle>
                                    <DialogDescription>
                                        give your drwaing a name so it can be
                                        easily searched up!
                                    </DialogDescription>
                                </DialogHeader>
                                <Input
                                    placeholder="black cat"
                                    onChange={(e) =>
                                        setInput("drawing_name", e.target.value)
                                    }
                                    autoFocus
                                    required
                                />
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button
                                            size={"lg"}
                                            type="submit"
                                            onClick={handleSubmit}
                                        >
                                            <Check />
                                            confirm
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Button
                            variant={"ghost"}
                            size={"lg"}
                            onClick={handleDownload}
                        >
                            <Download />
                            download png
                        </Button>
                    </div>
                </div>
                <Suspense>
                    <ExploreWrapper />
                </Suspense>
            </div>
            <div className="fixed bottom-0 left-0 p-4 flex gap-2">
                {user && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size={"icon"}
                                variant={"outline"}
                                onClick={() =>
                                    (window.location.href = "/auth/logout")
                                }
                            >
                                <LogOut />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>log out</TooltipContent>
                    </Tooltip>
                )}
                <Tooltip>
                    <Dialog>
                        <TooltipTrigger asChild>
                            <DialogTrigger asChild>
                                <Button size="icon" variant="outline">
                                    <CircleQuestionMark />
                                </Button>
                            </DialogTrigger>
                        </TooltipTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>lore</DialogTitle>
                                <DialogDescription>
                                    drawcat.lol is a place to submit cat
                                    drawings. good or bad, it doesn't matter -
                                    that's the whole charm.
                                    <br />
                                    <br />
                                    it was inspired by draw-dino, a similar
                                    project where students at hack club submit
                                    dino drawings. but as a hack clubber and a
                                    cat lover, i wanted to make my own spin on
                                    it.
                                    <br />
                                    <br />
                                    if you found any bugs or have suggestions,
                                    please open an issue in our github
                                    repository{" "}
                                    <a
                                        href="https://github.com/drawcat-lol/app"
                                        className="underline underline-offset-2"
                                    >
                                        here
                                    </a>
                                    .
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <a
                                    href="https://github.com/drawcat-lol/app"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button
                                        variant="outline"
                                        className="cursor-pointer"
                                    >
                                        <ExternalLink />
                                        github
                                    </Button>
                                </a>
                                <a
                                    href="https://ronykax.xyz"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button
                                        variant="outline"
                                        className="cursor-pointer"
                                    >
                                        <ExternalLink />
                                        ronykax.xyz
                                    </Button>
                                </a>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <TooltipContent>lore</TooltipContent>
                </Tooltip>
            </div>
            <Footer />
        </>
    );
};
