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
import useStartedDrawingStore from "@/stores/started-drawing";

export default () => {
    const { user } = useUserStore();
    const { theme, setTheme } = useTheme();

    const { inputs, setInput } = useSubmitFormStore();
    const [signupbro, setSignupbro] = useState(false);
    const { shouldConfetti, setShouldConfetti } = useConfettiStore();

    const catFacts = [
        "a cat's nose print is unique, like a fingerprint.",
        "cats spend 70% of their lives sleeping.",
        "cats have over 20 muscles that control their ears.",
        "a cat's purr vibrates at a frequency that promotes bone healing.",
        "cats can't taste sweetness.",
        "a cat's whiskers help them determine if they can fit through a space.",
        "cats have a third eyelid called a nictitating membrane.",
        "cats can rotate their ears 180 degrees.",
        "a group of cats is called a clowder.",
        "cats have over 100 different vocal sounds.",
        "cats can jump up to 6 times their body length.",
        "cats have scent glands on their cheeks and paws.",
        "a cat's tail helps them balance.",
        "cats can see in near darkness.",
        "cats spend 30% of their waking hours grooming themselves.",
    ];

    const [currentFactIndex, setCurrentFactIndex] = useState(0);

    const getRandomFact = () => {
        const newIndex = Math.floor(Math.random() * catFacts.length);
        setCurrentFactIndex(newIndex);
    };

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

    const { startedDrawing } = useStartedDrawingStore();
    function redirectToSignin(href: string) {
        if (startedDrawing) {
            setShouldDownload(true);
        }

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
        <div className="max-w-7xl mx-auto border-x-0 xl:border-x">
            <Suspense>
                <ExploreWrapper />
                <div className="border-y p-4 text-muted-foreground flex flex-col lg:flex-row gap-2 justify-between">
                    <div>
                        open source on <a href="https://github.com/drawcat-lol/app" className="hover:text-foreground underline">github</a>
                        <br />
                        <span
                            onClick={getRandomFact}
                            className="cursor-pointer hover:text-foreground transition-colors"
                            title="click for a new cat fact"
                        >
                            {catFacts[currentFactIndex]}
                        </span>
                    </div>

                    <div className="text-end">
                        © {new Date().getFullYear()} drawcat.lol
                        <br />
                        made with ❤️ by{" "}
                        <a href="https://ronykax.xyz" className="hover:text-foreground underline">ronykax</a>
                    </div>
                </div>
            </Suspense>
        </div>
    );
};
