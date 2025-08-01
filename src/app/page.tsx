"use client";

import CanvasWrapper from "@/components/canvas-wrapper";
import { Button } from "@/components/ui/button";
import useShouldSubmitStore from "@/stores/should-submit";
import useUserStore from "@/stores/user";
import {
    Bug,
    Check,
    Download,
    ExternalLink,
    HandHeart,
    LogOut,
    Moon,
    Sun,
    Trash,
    User,
} from "lucide-react";
import {
    SiDiscord,
    SiGithub,
    SiHackclub,
} from "@icons-pack/react-simple-icons";
import { Suspense, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import useShouldDownloadStore from "@/stores/should-download";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, suapbase } from "@/lib/utils";
import ExploreWrapper from "@/components/explore-wrapper";
import Footer from "@/components/footer";
import ConfettiExplosion from "react-confetti-explosion";
import useSubmitFormStore from "@/stores/inputs";
import useConfettiStore from "@/stores/should-confetti";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserIdentity } from "@supabase/supabase-js";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { toast } from "sonner";
import { useTheme } from "next-themes";
import useReloadExploreStore from "@/stores/reload";

export default () => {
    const { user } = useUserStore();
    const { theme, setTheme } = useTheme();

    const { inputs, setInput } = useSubmitFormStore();
    const [signupbro, setSignupbro] = useState(false);
    const { shouldConfetti, setShouldConfetti } = useConfettiStore();

    const { setShouldSubmit } = useShouldSubmitStore();
    function handleSubmit() {
        if (!inputs["drawing_name"]?.trim()) {
            toast.error("name is required", { richColors: true });
            return;
        }

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

    const [identity, setIdentity] = useState<UserIdentity | null>();
    useEffect(() => {
        if (!user) return;
        setIdentity(user.identities?.[0]);
    }, [user]);

    const { setShouldReloadExplore } = useReloadExploreStore();
    async function handleUserDrawingDelete() {
        if (!user) return;

        const { error, count } = await suapbase
            .from("list_v2")
            .delete({ count: "exact" })
            .eq("uid", user.id);

        if (error) {
            toast.error("couldn't delete your drawing!", { richColors: true });
        } else if (count === 0) {
            toast.error("you didn't even draw a cat!", { richColors: true });
        } else {
            toast.success("your drawing has been deleted :(", {
                richColors: true,
            });

            setShouldReloadExplore(true);
        }
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

            {user && identity && (
                <div className="fixed p-4 top-0 left-0">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={"link"}>
                                <User />
                                {identity.identity_data?.full_name}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="ml-4">
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <DropdownMenuItem
                                        onSelect={(e) => {
                                            e.preventDefault();
                                        }}
                                    >
                                        <Trash />
                                        delete my drawing
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            are you sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            your masterpiece of a drawing will
                                            never come back!
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel asChild>
                                            <Button variant={"outline"}>
                                                cancel
                                            </Button>
                                        </AlertDialogCancel>
                                        <AlertDialogAction asChild>
                                            <Button
                                                variant={"destructive"}
                                                onClick={
                                                    handleUserDrawingDelete
                                                }
                                            >
                                                confirm
                                            </Button>
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <DropdownMenuItem
                                onClick={() =>
                                    (location.href =
                                        "https://github.com/drawcat-lol/app")
                                }
                            >
                                <Bug />
                                report a bug
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    if (!theme) return;
                                    setTheme(
                                        theme === "dark" ? "light" : "dark"
                                    );
                                }}
                            >
                                {theme === "dark" ? <Sun /> : <Moon />}
                                toggle theme
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() =>
                                    (window.location.href = "/auth/logout")
                                }
                            >
                                <LogOut />
                                log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}

            <div
                className={cn(
                    "fixed w-full p-4 bg-accent border-b flex text-sm items-center duration-200 z-40",
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

                    <span className="mt-8 text-lg text-balance text-muted-foreground">
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

            <Footer />

            <div className="fixed bottom-0 left-0 p-4 flex gap-2">
                <Tooltip>
                    <Dialog>
                        <TooltipTrigger asChild>
                            <DialogTrigger asChild>
                                <Button size="icon" variant="outline">
                                    <HandHeart />
                                </Button>
                            </DialogTrigger>
                        </TooltipTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>drawcat.lol</DialogTitle>
                                <DialogDescription>
                                    drawcat.lol is a place to submit cat
                                    drawings. good or bad, it doesn't matter -
                                    that's the whole point.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <a
                                    href="https://github.com/drawcat-lol/app"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button
                                        variant="link"
                                        className="cursor-pointer"
                                    >
                                        <ExternalLink />
                                        github
                                    </Button>
                                </a>
                                <a
                                    href="https://ko-fi.com/ronykax"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button
                                        variant="outline"
                                        className="cursor-pointer"
                                    >
                                        <ExternalLink />
                                        tip
                                    </Button>
                                </a>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <TooltipContent>about</TooltipContent>
                </Tooltip>
            </div>
        </>
    );
};
